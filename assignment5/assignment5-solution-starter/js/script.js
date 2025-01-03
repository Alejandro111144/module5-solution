$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {

    // On first load, show home view with a random category
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,  // Substitute with buildAndShowHomeHTML function call
      true); // Explicitly setting the flag to get JSON from server processed into an object literal
  });

  // Builds HTML for the home page based on categories array
  // returned from the server.
  function buildAndShowHomeHTML (categories) {

    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {

        // Call chooseRandomCategory to get a random category
        const chosenCategory = chooseRandomCategory(categories);
        const chosenCategoryShortName = chosenCategory.short_name; // Extract short_name

        // Substitute {{randomCategoryShortName}} with chosen category short name
        var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", `'${chosenCategoryShortName}'`);

        // Insert the produced HTML into the main page
        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

        // Trigger loading of menu items for the chosen category
        $dc.loadMenuItems(chosenCategoryShortName);
      },
      false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  // ... (rest of the code remains unchanged)

})(window);