import { IoIosCafe, IoMdRestaurant } from "react-icons/io";
import {IoFastFood} from "react-icons/io5";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaShoppingBag, FaTshirt } from "react-icons/fa";
import { RiMedicineBottleFill, RiComputerFill } from "react-icons/ri";
import { HiEmojiHappy } from "react-icons/hi";

const CATEGORIES = {
  FOOD_AND_DRINKS: "Food & Drinks",
  BAR_AND_CAFE: "Bar & Cafè"
};

const CATEGORIES_ICON_ENUM = [
  {
    name: CATEGORIES.FOOD_AND_DRINKS,
    icon: <IoFastFood />,
    color: "red",
    subCategories: [
      {
        name: CATEGORIES.FOOD_AND_DRINKS,
        icon: <IoFastFood />,
      },
      {
        name: CATEGORIES.BAR_AND_CAFE,
        icon: <IoIosCafe/>
      },
    ],
  }
];

function _buildCategoriesApp(categories) {
  let subtree = [];
  if(categories === undefined) {
    return [];
  }

  for(const item of categories) {
    let newCat = ({
      text: item.name,
      value: item.name,
      label: (
        <>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", borderRadius: '50%', width: "30px", height: "30px", background: item.color}}>
          {item.icon}
        </div>
        &nbsp; {item.name}
        </>
      )
    });
    newCat.submenu = _buildCategoriesApp(item.subCategories);
    subtree.push(newCat);
  }

  return subtree;
}

export function build_categories_tree() {
  return _buildCategoriesApp(CATEGORIES_ICON_ENUM);
}