import { IoIosCafe, IoMdRestaurant } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { MdLocalGroceryStore, MdSubscriptions } from "react-icons/md";
import {
  FaShoppingBag,
  FaTshirt,
  FaQuestion,
  FaFileInvoiceDollar,
  FaParking,
  FaBus,
} from "react-icons/fa";
import {
  RiMedicineBottleFill,
  RiComputerFill,
  RiRefund2Fill,
} from "react-icons/ri";
import { HiEmojiHappy, HiReceiptTax } from "react-icons/hi";
import {
  AiFillCar,
  AiFillHome,
  AiFillGift,
  AiFillInsurance,
} from "react-icons/ai";
import {
  GiHealthNormal,
  GiIsland,
  GiBookCover,
  GiReceiveMoney,
} from "react-icons/gi";
import { BsFuelPumpFill } from "react-icons/bs";
import { BsHouseLockFill } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";

export const CATEGORIES = {
  UNKNOWN: "unknown",
  BAR: "bar",
  GROCERIES: "groceries",
  RESTAURANT: "restaurant",
  HEALTH_CARE: "health_care",
  FUEL: "fuel",
  BILLS: "bills",
  SHOPPING: "shopping",
  VEHICLE_MAINTENANCE: "vehicle_maintenance",
  PARKING: "parking",
  HOME_MAINTENANCE: "home_maintenance",
  FEES: "fees",
  HOLIDAYS: "holidays",
  REFUNDS: "refunds",
  ENTERTAINMENT: "entertainment",
  GIFTS: "gifts",
  PUBLIC_TRANSPORT: "public_transport",
  EDUCATION: "education",
  RENT_MORTGAGE: "rent_mortgage",
  SUBSCRIPTIONS: "subscriptions",
  INCOME: "income",
  INVESTMENT: "investment",
  INSURANCES: "insurances",
};

export const CATEGORIES_ICON_ENUM = {
  [CATEGORIES.UNKNOWN]: {
    icon: <FaQuestion style={{ color: "white" }} />,
    text: "Unknown",
    color: "rgb(60, 60, 60)",
  },
  [CATEGORIES.BAR]: {
    icon: <IoIosCafe style={{ color: "white" }} />,
    text: "Bar & cafè",
    color: "red",
  },
  [CATEGORIES.GROCERIES]: {
    icon: <MdLocalGroceryStore style={{ color: "white" }} />,
    text: "Groceries",
    color: "blue",
  },
  [CATEGORIES.RESTAURANT]: {
    icon: <IoMdRestaurant style={{ color: "white" }} />,
    text: "Restaurants",
    color: "red",
  },
  [CATEGORIES.HEALTH_CARE]: {
    icon: <GiHealthNormal style={{ color: "white" }} />,
    text: "Healthcare",
    color: "blue",
  },
  [CATEGORIES.FUEL]: {
    icon: <BsFuelPumpFill style={{ color: "white" }} />,
    text: "Fuel",
    color: "blue",
  },
  [CATEGORIES.BILLS]: {
    icon: <FaFileInvoiceDollar style={{ color: "white" }} />,
    text: "Bills, Invoices, Taxes",
    color: "blue",
  },
  [CATEGORIES.SHOPPING]: {
    icon: <FaShoppingBag style={{ color: "white" }} />,
    text: "Shopping",
    color: "blue",
  },
  [CATEGORIES.VEHICLE_MAINTENANCE]: {
    icon: <AiFillCar style={{ color: "white" }} />,
    text: "Vehicle Maintenance",
    color: "blue",
  },
  [CATEGORIES.PARKING]: {
    icon: <FaParking style={{ color: "white" }} />,
    text: "Parking",
    color: "blue",
  },
  [CATEGORIES.HOME_MAINTENANCE]: {
    icon: <AiFillHome style={{ color: "white" }} />,
    text: "Home Maintenance",
    color: "blue",
  },
  [CATEGORIES.FEES]: {
    icon: <HiReceiptTax style={{ color: "white" }} />,
    text: "Charges & Fees",
    color: "blue",
  },
  [CATEGORIES.HOLIDAYS]: {
    icon: <GiIsland style={{ color: "white" }} />,
    text: "Holidays, trips",
    color: "blue",
  },
  [CATEGORIES.REFUNDS]: {
    icon: <RiRefund2Fill style={{ color: "white" }} />,
    text: "Refunds",
    color: "blue",
  },
  [CATEGORIES.ENTERTAINMENT]: {
    icon: <HiEmojiHappy style={{ color: "white" }} />,
    text: "Entertainment",
    color: "blue",
  },
  [CATEGORIES.GIFTS]: {
    icon: <AiFillGift style={{ color: "white" }} />,
    text: "Gifts & Charity",
    color: "blue",
  },
  [CATEGORIES.PUBLIC_TRANSPORT]: {
    icon: <FaBus style={{ color: "white" }} />,
    text: "Public Transport",
    color: "blue",
  },
  [CATEGORIES.EDUCATION]: {
    icon: <GiBookCover style={{ color: "white" }} />,
    text: "Education & Self Improvement",
    color: "blue",
  },
  [CATEGORIES.RENT_MORTGAGE]: {
    icon: <BsHouseLockFill style={{ color: "white" }} />,
    text: "Rent, Mortgage",
    color: "blue",
  },
  [CATEGORIES.SUBSCRIPTIONS]: {
    icon: <MdSubscriptions style={{ color: "white" }} />,
    text: "Subscriptions (TV, Audio, ...)",
    color: "blue",
  },
  [CATEGORIES.INCOME]: {
    icon: <GiReceiveMoney style={{ color: "white" }} />,
    text: "Wages",
    color: "blue",
  },
  [CATEGORIES.INVESTMENT]: {
    icon: <TbPigMoney style={{ color: "white" }} />,
    text: "Investment",
    color: "blue",
  },
  [CATEGORIES.INSURANCES]: {
    icon: <AiFillInsurance style={{ color: "white" }} />,
    text: "Insurances",
    color: "blue",
  },
};

export const CATEGORIES_TREE = Object.keys(CATEGORIES).map((c) => ({
  value: CATEGORIES[c],
}));
