from transaction_classification import InferencePipeline, WalletCsvFileIngestion, WalletDataFramePreprocess, TransactionTextPreprocessing, TransactionTextToBOW
from sklearn import svm
from joblib import dump


if __name__ == '__main__':
    pipe = InferencePipeline([
        WalletCsvFileIngestion(),
        WalletDataFramePreprocess()
    ], [
        ('text_clean', TransactionTextPreprocessing()),
        ('bow', TransactionTextToBOW()),
        ('clf', svm.SVC(kernel='linear', C=1))
    ])
    pipe.fit('./dataset.csv')
    dump(pipe, 'transaction_classifier.joblib')