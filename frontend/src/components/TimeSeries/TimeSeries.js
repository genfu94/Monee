import React from "react";

class TimeSeries {
  constructor(data, index) {
    super();
    this.data = data;
    this.index = index;
  }

  _setDatetimeValue(date, value, timeUnit) {
    const modifiedDate = new Date(date.getTime());

    if (timeUnit === 'D') {
      modifiedDate.setDate(value);
      modifiedDate.setHours(0, 0, 0, 0);
    }
    if (timeUnit === 'H') modifiedDate.setHours(value, 0, 0, 0);

    return modifiedDate;
  }

  _bucket(date, freq) {
    freqQty = freq[0];
    freqTimeUnit = freq[1];
    
    return this._setDatetimeValue(date, freqQty, freqTimeUnit);
  }

  _reindex(start, freq) {
    let bucket = this._bucket(start, freq);
    console.log(bucket);
  }

  resample(freq) {
    this._reindex(this.index[0], freq);
  }
}

export default TimeSeries;