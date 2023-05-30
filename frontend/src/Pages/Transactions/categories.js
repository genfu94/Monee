import { IoIosCafe, IoMdRestaurant } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { MdLocalGroceryStore, MdSubscriptions } from "react-icons/md";
import { FaShoppingBag, FaTshirt, FaQuestion, FaFileInvoiceDollar, FaParking, FaBus } from "react-icons/fa";
import { RiMedicineBottleFill, RiComputerFill, RiRefund2Fill } from "react-icons/ri";
import { HiEmojiHappy, HiReceiptTax } from "react-icons/hi";
import {AiFillCar, AiFillHome, AiFillGift, AiFillInsurance} from "react-icons/ai";
import {GiHealthNormal, GiIsland, GiBookCover, GiReceiveMoney} from "react-icons/gi";
import {BsFuelPumpFill} from "react-icons/bs";
import {BsHouseLockFill} from "react-icons/bs";
import {TbPigMoney} from "react-icons/tb";

export const CATEGORIES = {
  UNKNOWN: 'unknown',
  BAR: 'bar',
  GROCERIES: 'groceries',
  RESTAURANT: 'restaurant',
  HEALTH_CARE: 'health_care',
  FUEL: 'fuel',
  BILLS: 'bills',
  SHOPPING: 'shopping',
  VEHICLE_MAINTENANCE: 'vehicle_maintenance',
  PARKING: 'parking',
  HOME_MAINTENANCE: 'home_maintenance',
  FEES: 'fees',
  HOLIDAYS: 'holidays',
  REFUNDS: 'refunds',
  ENTERTAINMENT: 'entertainment',
  GIFTS: 'gifts',
  PUBLIC_TRANSPORT: 'public_transport',
  EDUCATION: 'education',
  RENT_MORTGAGE: 'rent_mortgage',
  SUBSCRIPTIONS: 'subscriptions',
  INCOME: 'income',
  INVESTMENT: 'investment',
  INSURANCES: 'insurances',
};

export const CATEGORIES_ICON_ENUM = {
  [CATEGORIES.UNKNOWN]: {
    icon: <FaQuestion style={{ color: "white" }} />,
    color: "rgb(60, 60, 60)",
  },
  [CATEGORIES.BAR]: {
    icon: <IoIosCafe style={{ color: "white" }} />,
    color: "red",
  },
  [CATEGORIES.GROCERIES]: {
    icon: <MdLocalGroceryStore style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.RESTAURANT]: {
    icon: <IoMdRestaurant style={{ color: "white" }} />,
    color: "red",
  },
  [CATEGORIES.HEALTH_CARE]: {
      icon: <GiHealthNormal style={{ color: "white" }}/>,
      color: 'blue'
  },
  [CATEGORIES.FUEL]: {
    icon: <BsFuelPumpFill style={{ color: "white" }}/>,
    color: 'blue'
  },
  [CATEGORIES.BILLS]: {
    icon: <FaFileInvoiceDollar style={{ color: "white" }}/>,
    color: 'blue'
  },
  [CATEGORIES.SHOPPING]: {
    icon: <FaShoppingBag style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.VEHICLE_MAINTENANCE]: {
    icon: <AiFillCar style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.PARKING]: {
    icon: <FaParking style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.HOME_MAINTENANCE]: {
    icon: <AiFillHome style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.FEES]: {
    icon: <HiReceiptTax style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.HOLIDAYS]: {
    icon: <GiIsland style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.REFUNDS]: {
    icon: <RiRefund2Fill style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.ENTERTAINMENT]: {
    icon: <HiEmojiHappy style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.GIFTS]: {
    icon: <AiFillGift style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.PUBLIC_TRANSPORT]: {
    icon: <FaBus style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.EDUCATION]: {
    icon: <GiBookCover style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.RENT_MORTGAGE]: {
    icon: <BsHouseLockFill style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.SUBSCRIPTIONS]: {
    icon: <MdSubscriptions style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.INCOME]: {
    icon: <GiReceiveMoney style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.INVESTMENT]: {
    icon: <TbPigMoney style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.INSURANCES]: {
    icon: <AiFillInsurance style={{ color: "white" }} />,
    color: "blue",
  },
};

export const CATEGORIES_TREE = [
  {
    value: CATEGORIES.UNKNOWN,
  },
  {
    value: CATEGORIES.FOOD_AND_DRINKS,
    children: [
      {
        value: CATEGORIES.BAR_AND_CAFE,
      },
    ],
  },
  {
    value: CATEGORIES.SHOPPING,
    children: [
      {
        value: CATEGORIES.GROCERIES,
      },
    ],
  },
];
