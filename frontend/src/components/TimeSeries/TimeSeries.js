import React from "react";
import dayjs from "dayjs";

function setDateUnit(date, value, timeUnit) {
  const modifiedDate = new Date(date);

  if (timeUnit === "D") {
    modifiedDate.setDate(value);
    modifiedDate.setHours(0, 0, 0, 0);
  }
  if (timeUnit === "H") modifiedDate.setHours(value, 0, 0, 0);

  return modifiedDate;
}

class Resampler {
  constructor() {
    this.buckets = new Map();
  }

  _bucketizeValue(value, bucketSize) {
    return Math.trunc(value / bucketSize) * bucketSize;
  }

  _assignToBucket(date, freq) {
    const freqQty = freq[0];
    const freqTimeUnit = freq[1];
    let bucketValue = 0;
    if (freqTimeUnit === "H")
      bucketValue = this._bucketizeValue(date.getHours(), freqQty);
    else if (freqTimeUnit === "D")
      bucketValue = this._bucketizeValue(date.getDate(), freqQty);

    return setDateUnit(date, bucketValue, freqTimeUnit);
  }

  resample(series, freq) {
    const freqQty = freq[0];
    const freqTimeUnit = freq[1];
    const mapDayJSUnit = {
      D: "days",
      H: "hours",
    };

    if (series.series.length === 0) {
      return;
    }

    let bucket = this._assignToBucket(series.loc(0).index, freq);
    const endBucket = this._assignToBucket(series.loc(-1).index, freq);

    while (bucket <= endBucket) {
      this.buckets.set(dayjs(bucket).format("YYYY-MM-DD, HH:mm:ss"), null);
      bucket = dayjs(bucket).add(freqQty, mapDayJSUnit[freqTimeUnit]).toDate();
    }

    for (const [idx, value] of series.iterate()) {
      const bucketizedDate = dayjs(this._assignToBucket(idx, freq)).format(
        "YYYY-MM-DD, HH:mm:ss"
      );

      if (!this.buckets.get(bucketizedDate))
        this.buckets.set(bucketizedDate, []);

      this.buckets.get(bucketizedDate).push(value);
    }
  }

  min() {
    for (const [idx, values] of this.buckets) {
      if (values) {
        this.buckets.set(idx, Math.min(...values));
      }
    }

    const newIndex = Array.from(this.buckets.keys(), (x) =>
      dayjs(x, "YYYY-MM-DD, HH:mm:ss").toDate()
    );
    return new TimeSeries(newIndex, Array.from(this.buckets.values()));
  }
}

class TimeSeries {
  constructor(index, data) {
    this.series = [];

    for (let i = 0; i < index.length; i++) {
      this.series.push({ index: index[i], data: data[i] });
    }

    this.series.sort((a, b) => a.index.getTime() > b.index.getTime());
  }

  filter(dateStart, dateEnd) {
    this.series = this.series.filter(
      (e) => e.index >= dateStart && (!dateEnd || e.index <= dateEnd)
    );
    return this;
  }

  cumulate() {
    for (const [i, el] of this.series.entries()) {
      this.series[i].data += i === 0 ? 0 : this.series[i - 1].data;
    }

    return this;
  }

  at(idx) {
    return this.series.find((e) => e.index.getTime() === idx.getTime());
  }

  loc(idx) {
    return this.series.slice(idx)[0];
  }

  *iterate() {
    for (const el of this.series) {
      yield [el.index, el.data];
    }
  }

  fillNa() {
    let lastValue = NaN;
    for (const [i, el] of this.series.entries()) {
      if (!el.data) this.series[i].data = lastValue;
      else lastValue = el.data;
    }

    return this;
  }

  toPlotData() {
    let plotData = [];

    for (const [idx, value] of this.iterate()) {
      plotData.push({ x: idx, y: value });
    }

    return plotData;
  }

  resample(freq) {
    const resampler = new Resampler();
    resampler.resample(this, freq);
    return resampler;
  }
}

export default TimeSeries;
