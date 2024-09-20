const parent = document.querySelector(".parent");
const child = document.querySelector(".child");
const input = document.querySelector("input");
const customScrollbarDiv = document.querySelector(".custom-scrollbar-div");

const getScrollbarWidth = () => {
  const childWidth = child.getBoundingClientRect().width;

  //this node is added to the parent to get the exact width of the scrollbar
  const tempNode = document.createElement("div");
  parent.appendChild(tempNode);

  //the width of the parent minus the padding space
  const parentInsideWidth = tempNode.getBoundingClientRect().width;

  const missingScrollbarWidth = childWidth - parentInsideWidth;
  const scrollbarWidth = (100 * parentInsideWidth) / childWidth;

  //remove the temp node because we wont need it anymore
  tempNode.remove();

  //calculate the diferent in percentage of the parent and child width's
  const percentageOfTheParentChildWidths =
    (100 * (missingScrollbarWidth + parentInsideWidth)) / parentInsideWidth;

  return {
    missingScrollbarWidth,
    scrollbarWidth,
    percentageOfTheParentChildWidths,
  };
};

const manageRangeScrollbarWidth = (isScrolled) => {
  //set only the value atttribute of the range input if the parent was scrolled
  if (isScrolled) {
    input.setAttribute("value", parent.scrollLeft);
    return;
  }

  //get the scrollbar width's
  const sbWidth = getScrollbarWidth();

  //set the max atttribute of the range input
  input.setAttribute("max", sbWidth.missingScrollbarWidth);

  //change the range input thumb width global variable
  document.documentElement.style.cssText += `--input-range-thumb-width: ${sbWidth.scrollbarWidth}%`;
};

const manageCustomScrollbar = (isScrolledOnParent) => {
  //if the scroll was done in the parent element, then we'll ajust the custom scrollbar, otherwise we'll ajust the parent scrollbar
  isScrolledOnParent
    ? customScrollbarDiv.scrollTo({
        left: parent.scrollLeft,
      })
    : parent.scrollTo({
        left: customScrollbarDiv.scrollLeft,
      });

  //get the scrollbar width's and update the --custom-scrollbar-div-child-width global variable
  const sbWidth = getScrollbarWidth();
  document.documentElement.style.cssText += `--custom-scrollbar-div-child-width: ${
    //this 12 is to compensate the scrollbar arrows, if you are using a custom scrollbar you might want to remove/ajust this value
    sbWidth.percentageOfTheParentChildWidths + 12
  }%`;
};

window.onload = () => {
  //to check if the the parent as had any change on resize
  window.addEventListener("resize", () => {
    manageRangeScrollbarWidth();
  });

  parent.addEventListener("scroll", () => {
    manageRangeScrollbarWidth(true);
    manageCustomScrollbar(true);
  });

  customScrollbarDiv.addEventListener("scroll", () => {
    manageCustomScrollbar();
  });

  manageCustomScrollbar();

  //to check for a change in the range input value and force a scroll in the parent element
  input.addEventListener("input", (e) => {
    parent.scrollTo({
      left: e.target.value,
    });
  });

  manageRangeScrollbarWidth();
};
