import { IoIosCafe, IoMdRestaurant } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaShoppingBag, FaTshirt, FaQuestion } from "react-icons/fa";
import { RiMedicineBottleFill, RiComputerFill } from "react-icons/ri";
import { HiEmojiHappy } from "react-icons/hi";

export const CATEGORIES = {
  UNKNOWN: "Unknown",
  FOOD_AND_DRINKS: "Food & Drinks",
  BAR_AND_CAFE: "Bar & Cafè",
  SHOPPING: "Shopping",
  GROCERIES: "Groceries",
};

export const CATEGORIES_ICON_ENUM = {
  [CATEGORIES.UNKNOWN]: {
    icon: <FaQuestion style={{ color: "white" }} />,
    color: "rgb(60, 60, 60)",
  },
  [CATEGORIES.FOOD_AND_DRINKS]: {
    icon: <IoFastFood style={{ color: "white" }} />,
    color: "red",
  },
  [CATEGORIES.BAR_AND_CAFE]: {
    icon: <IoIosCafe style={{ color: "white" }} />,
    color: "red",
  },
  [CATEGORIES.SHOPPING]: {
    icon: <FaShoppingBag style={{ color: "white" }} />,
    color: "blue",
  },
  [CATEGORIES.GROCERIES]: {
    icon: <MdLocalGroceryStore style={{ color: "white" }} />,
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
