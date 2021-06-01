// Storage Controller
const StorageCtrl = (function () {


    // public methods
    return {
        storeItem: function(item) {
            let items;
            // check if any items in ls
            if(localStorage.getItem("items") === null) {
                items = [];
                // Push new item
                items.push(item);
                // Set localStorage (convert object -> string)
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                // Get what is already in ls (convert string -> object)
                items = JSON.parse(localStorage.getItem("items"));
                // Push new item
                items.push(item);
                // Re-set localStorage (convert object -> string)
                localStorage.setItem("items", JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach(function(item, index) {
                if(item.id === updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach(function(item, index) {
                if(item.id === id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem("items");
        }
    }
})();

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
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    
    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        getItemById: function(id) {
            let result = null;
            // loop through items
            data.items.forEach(function(item) {
                if(item.id === id) {
                    result = item;
                }
            })
            return result
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id) {
            // Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);

        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
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
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
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
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
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
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateListItem: function(item) {
            // // My solution
            // const li = document.getElementById(`item-${item.id}`);
            // li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
            // <a href="#" class="secondary-content">
            //   <i class="edit-item fa fa-pencil"></i>
            // </a>`;

            // Course solution
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
                }
            });
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeItems: function() {
            // // My solution
            // get item list
            // const itemList = document.querySelector(UISelectors.itemList);
            // itemList.innerHTML = "";

            // Course solution
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            });
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
        },
        clearEditState: function(e) {
            // clear input fields
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
            // When Edit State is cleared, Add Meal Button is showing
            // Code below makes the button clickable again
            // This method allows 'Enter' Keypress when not in Edit State
            document.querySelector(UISelectors.addBtn).disabled = false;            
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
            // When in Edit State, "Add Meal" Button is hidden
            // Code below makes the button unclickable when hidden
            // Does NOT allow 'Enter' Keypress as the button is disabled
            document.querySelector(UISelectors.addBtn).disabled = true;
        },
    }
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // Load Event Listeners
    const loadEventListeners = function(){
        // get UISelectors
        const UISelectors = UICtrl.getSelectors();

        // Add event listeners
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // Edit icon click Event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener("click", (e) => {
            UICtrl.clearEditState();
            e.preventDefault();
        });

        // Clear all items event
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
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

            // Store in local storage
            StorageCtrl.storeItem(newItem);

            // Clear input fields
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    }

    // Item edit click
    const itemEditClick = function(e) {
        if(e.target.classList.contains("edit-item")) {
            // Get list item id (item-0, item-1 etc.)
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split("-");
            // Get the actual id
            const id = parseInt(listIdArr[1]);
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Updete item submit
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UICtrl
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete item submit
    const itemDeleteSubmit = function(e) {
        // get current item id
        const id = ItemCtrl.getCurrentItem().id;

        // delete from data structure
        ItemCtrl.deleteItem(id);

        // delete from UI
        UICtrl.deleteListItem(id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from  local storage
        StorageCtrl.deleteItemFromStorage(id);

        UICtrl.clearEditState(); 

        e.preventDefault();
    }

    // Clear all items
    const clearAllItemsClick = function(e) {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Delete all items from UI
        UICtrl.removeItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // clear from local storage
        StorageCtrl.clearItemsFromStorage();

        UICtrl.hideList();

        e.preventDefault();
    }


    // Public methods
    return {
        init: function() {
            console.log("Initializing the App...");
            // Clear edit state / set initial state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
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
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize the App
App.init();