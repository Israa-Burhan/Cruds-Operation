var form = document.getElementById("productForm");
var inputs = document.querySelectorAll(".myInput");
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var taxes = document.getElementById("taxes");
var ads = document.getElementById("ads");
var discount = document.getElementById("discount");
var total = document.getElementById("total");
var count = document.getElementById("count");
var category = document.getElementById("category");
var brand = document.getElementById("brand");
var imgInput = document.getElementById("imgInput");
var chooseImageButton = document.getElementById("chooseImageButton");
var imageBase64 = "";
var submitButton = document.getElementById("addProduct");
var tbody = document.getElementById("tbody");
var confirmBox = document.getElementById("confirmBox");
var confirmYes = document.getElementById("confirmYes");
var confirmNo = document.getElementById("confirmNo");
var mode = "create";
var tempIndex;
var imageSelected = false;

// add products to array ✔️
// add products to local storage ✔️
// display (read) products from local storage in table✔️
// calculate total price ✔️
// add image to product to localStorage and table ✔️
// delete products from local storage and table ✔️
// update products in local storage and table ✔️
// delete all products from local storage and table ✔️
// show total number of products ✔️
// search products by name ✔️
// increment and decrement count  ✔️
// reqular expression for validation ✔️
// input change border color on input focus ✔️
// disabled button if form is not valid or image is not selected ✔️
// clear form inputs ✔️

//////////////////////////

// add products to array
var productlist = [];
// Submits the form and adds a new product to the list.
form.addEventListener("submit", function (event) {
	event.preventDefault(); // prevent form submission
	addProduct(productlist);
	imageSelected = false;
	checkFormValidity(); // check form validity
	clearInputs(); // clear form inputs
});
/**
 * Adds a new product to the list or updates an existing one.
 * @param {Array} productlist - The array containing all products.
 * @returns {void} - this function doesn't return anything
 */
function addProduct(productlist) {
	var product = {
		name: productName.value.trim(),
		price: parseFloat(productPrice.value) || 0,
		taxes: parseFloat(taxes.value) || 0,
		ads: parseFloat(ads.value) || 0,
		discount: parseFloat(discount.value) || 0,
		count: parseInt(count.value) || 1,
		total: parseFloat(total.textContent),
		category: category.value.trim(),
		brand: brand.value,
		image: imageBase64,
	};
	if (mode === "create") {
		productlist.push(product);
	} else {
		// تحديث المنتج الحالي
		productlist[tempIndex] = product;
		mode = "create";

		// حذف حالة التحديث من localStorage
		localStorage.removeItem("editMode");
		localStorage.removeItem("editIndex");

		submitButton.innerHTML = " Add Product";
		submitButton.style.background = "";
	}
	localStorage.setItem("products", JSON.stringify(productlist));

	displayProducts(productlist);
	updateTotalProducts();
}

// add products to local storage
if (localStorage.getItem("products")) {
	productlist = JSON.parse(localStorage.getItem("products"));
} else {
	productlist = [];
}
displayProducts(productlist);
updateTotalProducts();

/**
 * Displays the list of products in the table.
 * @param {Array} productlist - The array containing all products.
 * @returns {void} - this function doesn't return anything
 */
function displayProducts(productlist) {
	var box = "";
	for (var i = 0; i < productlist.length; i++) {
		box += `
    <tr>
    <td>${i + 1}</td>
    <td>${productlist[i].name}</td>
    <td><img src="${
			productlist[i].image
		}" class="img-thumbnail" width="65px" style="max-width: 100px;"></td>
    <td>${productlist[i].price}</td>
    <td>${productlist[i].taxes}</td>
    <td>${productlist[i].ads}</td>
    <td>${productlist[i].discount}</td>
    <td>${productlist[i].total}</td>
    <td>${productlist[i].category}</td>
    <td>${productlist[i].brand}</td>
    <td><button onclick="updatecount(${i},${1})" class="incCount"><i class="fas fa-plus-circle"></i></button></td>
		<td>${productlist[i].count}</td>
		<td><button onclick="updatecount(${i},${-1})" class="decCount"><i class="fas fa-minus-circle"></i></button></td>
		<td><button onclick="updatepro(${i})" class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button></td>
		<td><button onclick="deletProduct(${i})" class="deleteBtn"><i class="fa-solid fa-trash"></i></button></td>

    </tr>
    `;
	}
	tbody.innerHTML = box;

	//delete all
	var btndeleteall = document.getElementById("deleteall");
	if (productlist.length > 0) {
		btndeleteall.innerHTML = `<button onclick="deleteall()">Delete All </button>`;
	} else {
		btndeleteall.innerHTML = "";
	}
}

/**
 * Calculates and updates the total price of a product.
 * @param {HTMLElement} productPrice - The input field for the product price.
 * @param {HTMLElement} taxes - The input field for taxes.
 * @param {HTMLElement} ads - The input field for additional ads cost.
 * @param {HTMLElement} discount - The input field for the discount amount.
 * @param {HTMLElement} total - The element displaying the total price.
 *
 * @returns {void} - This function does not return anything.
 */
function getTotal() {
	if (productPrice.value.trim() != "") {
		var result =
			+productPrice.value + +taxes.value + +ads.value - +discount.value;
		total.textContent = result;
		total.style.background = "#040";
	} else {
		total.textContent = "";
		total.style.background = "#d0d0d0";
	}
}

// add image to product to localStorage and table
chooseImageButton.addEventListener("click", function () {
	imgInput.click();
});
imgInput.addEventListener("change", function () {
	var file = this.files[0];
	if (file) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			imageBase64 = reader.result;

			document.getElementById("previewImage").src = imageBase64;
			document.getElementById("imageName").textContent = file.name;
			document.getElementById("imagePreviewContainer").style.display = "flex";
		};
	}
});

/**
 * Deletes a product from the product list based on the provided index.
 * Displays a confirmation box before deletion.
 *
 * @param {number} index - The index of the product to delete from the product list.
 *
 * @returns {void} - This function does not return anything.
 */
function deletProduct(index) {
	confirmBox.style.display = "block"; // Show the confirmation box
	confirmYes.onclick = function () {
		productlist.splice(index, 1); // Remove the product at the given index
		localStorage.setItem("products", JSON.stringify(productlist)); // Update the localStorage
		displayProducts(productlist); // Display updated product list
		updateTotalProducts(); // Update the total number of products
		confirmBox.style.display = "none"; // Hide the confirmation box
	};
	confirmNo.onclick = function () {
		confirmBox.style.display = "none"; // Hide the confirmation box if user cancels
	};
}

/**
 * Updates the product form with the details of the selected product for editing.
 * Changes the submit button to "Update Product" and stores the current product index for future reference.
 *
 * @param {number} index - The index of the product to update from the product list.
 *
 * @returns {void} - This function does not return anything.
 */
function updatepro(index) {
	productName.value = productlist[index].name;
	productPrice.value = productlist[index].price;
	taxes.value = productlist[index].taxes;
	ads.value = productlist[index].ads;
	discount.value = productlist[index].discount;
	count.value = productlist[index].count;
	category.value = productlist[index].category;
	brand.value = productlist[index].brand;
	getTotal();

	if (productlist[index].image) {
		document.getElementById("previewImage").src = productlist[index].image;
		document.getElementById("imagePreviewContainer").style.display = "flex";
		imageBase64 = productlist[index].image;
	}

	// تغيير زر الإضافة إلى "تحديث"
	submitButton.innerHTML = "Update Product";
	submitButton.style.background = "#f39c12";
	mode = "update";
	tempIndex = index;
	checkFormValidity();
	// حفظ حالة التحديث في localStorage
	localStorage.setItem("editMode", "update");
	localStorage.setItem("editIndex", index);
}
/**
 * Runs when the window is loaded. Checks if there is a product in update mode saved in localStorage,
 * and if so, it restores the update state by populating the form with the selected product's details.
 *
 * @returns {void} - This function does not return anything.
 */
window.onload = function () {
	if (localStorage.getItem("editMode") === "update") {
		// Check if we are in update mode
		var index = localStorage.getItem("editIndex"); // Retrieve the saved product index
		if (index !== null && productlist[index]) {
			// Check if index is valid and product exists
			updatepro(index); // Restore the update state by filling the form with product details
		}
	}
};

/**
 * Displays a confirmation modal to delete all products from the product list.
 * If confirmed, it clears the product list from both the localStorage and the array.
 *
 * @returns {void} - This function does not return anything.
 */
function deleteall() {
	var modal = document.getElementById("confirmModal");
	var confirmBtn = document.getElementById("confirmDelete");
	var cancelBtn = document.getElementById("cancelDelete");

	modal.style.display = "flex";

	confirmBtn.onclick = function () {
		localStorage.removeItem("products");
		productlist.splice(0);
		displayProducts(productlist);
		updateTotalProducts();
		modal.style.display = "none";
	};

	cancelBtn.onclick = function () {
		modal.style.display = "none";
	};
}

/**
 * Updates the displayed total number of products in the product list.
 *
 * @returns {void} - This function does not return anything.
 */
function updateTotalProducts() {
	document.getElementById("totalProducts").textContent = productlist.length;
}

/**
 * Updates the count of a product in the product list based on the specified index and change value.
 * It increments or decrements the product count and updates the display and localStorage.
 *
 * @param {number} index - The index of the product in the product list to update.
 * @param {number} x - The value to change the product count by (positive to increment, negative to decrement).
 *
 * @returns {void} - This function does not return anything.
 */
function updatecount(index, x) {
	if (productlist[index].count == 0 && x == -1) {
		productlist[index].count = 0;
	} else {
		productlist[index].count = Number(productlist[index].count) + Number(x);
	}
	localStorage.setItem("products", JSON.stringify(productlist)); // حفظ التعديلات
	displayProducts(productlist);
}

/**
 * Searches for products in the product list based on the search term and displays the matching products.
 *
 * @param {string} term - The search term to filter the products by. It is case-insensitive.
 *
 * @returns {void} - This function does not return anything, it updates the product display.
 */
function searchProduct(term) {
	var searchProduct = [];
	for (var i = 0; i < productlist.length; i++) {
		if (productlist[i].name.toLowerCase().includes(term.toLowerCase())) {
			searchProduct.push(productlist[i]);
		}
	}
	displayProducts(searchProduct);
}

// input change border color on input focus
inputs.forEach((input) => {
	input.addEventListener("input", function () {
		if (input.value.trim() !== "") {
			input.classList.add("changed");
		} else {
			input.classList.remove("changed");
		}
	});
});

/**
 * Clears all input fields and resets related elements to their default values.
 * This includes product details such as name, price, taxes, and image preview.
 *
 * @returns {void} - This function does not return anything.
 */
function clearInputs() {
	productName.value = "";
	productPrice.value = "";
	taxes.value = "";
	ads.value = "";
	discount.value = "";
	count.value = "";
	total.textContent = "";
	category.value = "";
	brand.value = "";
	imageBase64 = "";
	imgInput.value = "";
	document.getElementById("imagePreviewContainer").style.display = "none";
}

// disabled button if form is not valid or image is not selected
submitButton.disabled = true;
// check form validity on input events
form.addEventListener("input", function () {
	checkFormValidity();
});
brand.addEventListener("change", checkFormValidity);

/**
 * Checks the validity of the form inputs and enables or disables the submit button based on the input values.
 * It checks if all required fields are filled based on the current mode (create or update).
 *
 * @returns {void} - This function does not return anything, but it modifies the state of the submit button.
 */
function checkFormValidity() {
	const inputs = form.querySelectorAll(".myInput, .myPrice");
	const hasEmptyInput = Array.from(inputs).some(
		(input) => input.value.trim() === ""
	);

	const isBrandEmpty = brand.value.trim() === "";
	const isCreatingWithoutImage = mode === "create" && !imageSelected;
	const isUpdating = mode === "update";

	if (isUpdating) {
		// mode == update
		submitButton.disabled = hasEmptyInput || isBrandEmpty;
	} else {
		// mode == create
		submitButton.disabled =
			hasEmptyInput || isBrandEmpty || isCreatingWithoutImage;
	}
}
imgInput.addEventListener("change", function (event) {
	if (event.target.files.length > 0) {
		imageSelected = true;
		checkFormValidity();
	}
});
