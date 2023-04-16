import React from "react";
import "./TransactionItem.style.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function TransactionItem(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  let transaction = props.transaction;
  return (
    <div style={{display: "flex", width:"100%", justifyContent: "center"}}>
      <div
        className="flex-centered selectable-item transaction"
        onClick={handleOpen}
      >
        <div className="flex-centered">
          <input type="checkbox" />
        </div>
        <div className="flex-centered transaction-info-container">
          <div className="flex-centered transaction-info">
            <div className="flex-centered transaction-info-category">
              <span className="flex-centered circle">
                <HiOutlineLightBulb style={{ color: "#fff" }} />
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "0.8em",
                  fontFamily: "Montserrat",
                }}
              >
                &nbsp;Energy, utilities
              </span>
            </div>
            <div className="flex-centered transaction-info-account">
              <BsCircleFill
                style={{ fontSize: "0.5em", color: "rgb(255, 160, 0)" }}
              />
              &nbsp; N26 - Conto Corrente Principale
            </div>
            <div className="flex-centered transaction-info-entity">
              {transaction.origin}
            </div>
            <div className="flex-centered transaction-info-description">
              {transaction.text}
            </div>
          </div>
          <div className="flex-centered-vertical transaction-amount-section">
            <div
              className={`${
                transaction.transaction_amount.amount > 0
                  ? "transaction-income"
                  : "target-currency-transaction-amount"
              }`}
            >
              {transaction.transaction_amount.currency}&nbsp;
              {transaction.transaction_amount.amount}
            </div>
            <div className="original-currency-transaction-amount">
              {transaction.transaction_amount.currency}&nbsp;
              {transaction.transaction_amount.amount}
            </div>
          </div>
        </div>
      </div>

      <Modal disableAutoFocus={true} open={open} onClose={handleClose}>
        <Box sx={style}>
          {transaction.transaction_amount.amount}
        </Box>
      </Modal>
    </div>
  );
}
