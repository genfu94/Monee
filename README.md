<h1 align="center">Budget App</h1>

> Personal Finance web app to automatically keep track and generate reports of expenses directly from your credit cards and bank accounts data!

## 🚀 Install
First create a Nordigen Account at https://nordigen.com and acquire user key and secrets.

Then create a `config.ini` file inside the `backend/` folder containing the Nordigen secret id and key:
```ini
[NORDIGEN]
NordigenSecretID=[Your secret id]
NordigenSecretKey=[Your secret key]
```

Finally simply run from the root folder:
```
docker compose up
```


## ✨ Demo
Currently the application allows to add a new bank account, visualize the amount on each and list all the transactions (still not categorized):

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/loading.png?raw=true)

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/accounts.png?raw=true)

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/add_new_account.png?raw=true)

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/transactions.png?raw=true)