from sklearn.feature_extraction.text import CountVectorizer
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
import numpy as np

count_vec = CountVectorizer()
bow = count_vec.fit_transform(["BBVA.IT", "ADR MOBILITY SRL", "Cena Livella", "Cena Indiano", "Bowling"])
#bow = np.array(bow.todense())
print(bow)