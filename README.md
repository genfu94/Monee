<h1 align="center">Monee</h1>

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

Currently the application allows to add a new bank account, visualize the amount on each and list all the transactions. Also employs a transaction categorization algorithm that improves as the user correct the wrong transaction categories:

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/Dashboard.png?raw=true)

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/Add_new_bank.png?raw=true)

![name-of-you-image](https://github.com/genfu94/budget-app/blob/main/images/Transactions.png?raw=true)
