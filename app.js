// Storage Controller

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // private data
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }
    
    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        logData: function(){
            return data;
        },
        addItem: function(name, calories ) {
            let ID;
            // Create ID
            if(data.items.length > 0) {
                // ID = data.items.length;
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // create new item
            const newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function() {
            let total = 0;
            // Loop through items and add calories
            data.items.forEach(function(item) {
                total += item.calories;
            })
            // Set total calories in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        }
    }

})();

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    }
    // Public methods
    return {
        populateItemList: function(items) {
            let html = "";

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        addListItem: function(item) {
            document.querySelector(UISelectors.itemList).style.display = "block";
            // Create li element
            const li = document.createElement("li");
            // Add class
            li.className = "collection-item";
            // Add ID
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        }
    }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    // Load Event Listeners
    const loadEventListeners = function(){
        // get UISelectors
        const UISelectors = UICtrl.getSelectors();
        // Add event listeners
        document.querySelector(UISelectors.addBtn).addEventListener("click", ItemAddSubmit);
    }

    // Add item submit
    const ItemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        // Check for name and calorie input
        if(input.name !== "" && input.calories !== "") {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Clear input fields
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    }


    // Public methods
    return {
        init: function() {
            console.log("Initializing the App...");
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            console.log(items);
            // Check if any items
            if(items.length > 0) {
                // Populate list with items
                UICtrl.populateItemList(items);
            } else {
                UICtrl.hideList();
            }
            
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();

        }
    }
})(ItemCtrl, UICtrl);

// Initialize the App
App.init();