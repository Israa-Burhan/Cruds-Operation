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

////////////////////

// add products to array

var productlist = [];
// form function
form.addEventListener("submit", function (event) {
	event.preventDefault(); // منع الإرسال الافتراضي للنموذج
	addProduct(productlist);
	imageSelected = false;
	checkFormValidity(); // تحديث حالة الزر بعد الإضافة
	clearInputs();
});
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
		mode = "create"; // إعادة الوضع إلى "إضافة"

		// حذف حالة التحديث من localStorage
		localStorage.removeItem("editMode");
		localStorage.removeItem("editIndex");

		submitButton.innerHTML = " Add Product"; // إرجاع زر الإضافة لحالته الأصلية
		submitButton.style.background = "";
	}
	localStorage.setItem("products", JSON.stringify(productlist));
	console.log(productlist);
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

// display (read) products from local storage in table

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
  <td>${productlist[i].count}</td>
    <td><button onclick="updatecount(${i},${1})" class="incCount"><i class="fas fa-plus-circle"></i></button></td>
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

// calculate total price
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
	imgInput.click(); // محاكاة الضغط على input[type="file"]
});

imgInput.addEventListener("change", function () {
	var file = this.files[0]; //  الحصول على الملف
	if (file) {
		var reader = new FileReader(); // قراءة ملف الصورة
		reader.readAsDataURL(file); // تحويل الصورة إلى Base64
		reader.onload = function () {
			imageBase64 = reader.result; // حفظ Base64
			// console.log("Image Base64: ", imageBase64); // تحقق من Base64
			document.getElementById("previewImage").src = imageBase64; // عرض الصورة في المعاينة
			document.getElementById("imageName").textContent = file.name;
			document.getElementById("imagePreviewContainer").style.display = "flex"; // إظهار حاوية المعاينة
		};
	}
});

// delete products from local storage and table

function deletProduct(index) {
	confirmBox.style.display = "block"; // إظهار نافذة التأكيد
	confirmYes.onclick = function () {
		productlist.splice(index, 1);
		localStorage.setItem("products", JSON.stringify(productlist));
		displayProducts(productlist);
		updateTotalProducts();
		confirmBox.style.display = "none"; // إخفاء النافذة بعد الحذف
	};
	confirmNo.onclick = function () {
		confirmBox.style.display = "none"; // إخفاء النافذة بدون حذف
	};
}

// update products in local storage and table

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
		document.getElementById("imagePreviewContainer").style.display = "flex"; // إظهار المعاينة
		imageBase64 = productlist[index].image; // حفظ الصورة في متغير الصورة قبل التحديث
	}

	// تغيير زر الإضافة إلى "تحديث"
	submitButton.innerHTML = "Update Product";
	submitButton.style.background = "#f39c12"; // لون مميز للزر عند التحديث
	mode = "update"; // تغيير الحالة إلى "تحديث"
	tempIndex = index; // تخزين فهرس المنتج المراد تعديله
	checkFormValidity();
	// حفظ حالة التحديث في localStorage
	localStorage.setItem("editMode", "update");
	localStorage.setItem("editIndex", index);
}
// هنا نتحقق من الصفحة بعد عمل ريفريش هل هو حالة تحديث ام اضافة منتج ليتم حل مشكلة بعد الريفريش يردع الى الاضافة
window.onload = function () {
	if (localStorage.getItem("editMode") === "update") {
		var index = localStorage.getItem("editIndex");
		if (index !== null && productlist[index]) {
			updatepro(index); // استعادة حالة التحديث
		}
	}
};

// delete all products from local storage and table

function deleteall() {
	localStorage.removeItem("products");
	productlist.splice(0);
	displayProducts(productlist);
	updateTotalProducts();
}

// show total number of products

function updateTotalProducts() {
	document.getElementById("totalProducts").textContent = productlist.length;
}

// increment and decrement count

function updatecount(index, x) {
	if (productlist[index].count == 0 && x == -1) {
		productlist[index].count = 0;
	} else {
		productlist[index].count = Number(productlist[index].count) + Number(x);
	}
	localStorage.setItem("products", JSON.stringify(productlist)); // حفظ التعديلات
	displayProducts(productlist);
}

// search products by name

function searchProduct(term) {
	var searchProduct = [];
	for (var i = 0; i < productlist.length; i++) {
		if (productlist[i].name.toLowerCase().includes(term.toLowerCase())) {
			searchProduct.push(productlist[i]);
		}
	}
	displayProducts(searchProduct);
}
// reqular expression for validation

function validateProductName(name) {
	var regex = /^[a-zA-Z\s]{3,}$/; // اسم يحتوي على حروف أو أرقام، ويكون 3 أحرف على الأقل
	return regex.test(name);
}

// input change border color on input focus
inputs.forEach((input) => {
	input.addEventListener("input", function () {
		if (input.value.trim() !== "") {
			input.classList.add("changed"); // عند الكتابة يتغير اللون ويبقى ثابتًا
		} else {
			input.classList.remove("changed"); // إذا كان الحقل فارغًا، يعود إلى اللون الافتراضي
		}
	});
});

//clear inputs
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
	document.getElementById("imagePreviewContainer").style.display = "none"; // إخفاء المعاينة بعد المسح
}

// disabled button if form is not valid or image is not selected

submitButton.disabled = true;
// التحقق من الحقول
form.addEventListener("input", function () {
	checkFormValidity(); // استدعاء التحقق عند أي تغيير في الحقول
});
brand.addEventListener("change", checkFormValidity);
// دالة التحقق من الحقول
function checkFormValidity() {
	let allFieldsFilled = true;

	// التحقق من جميع الحقول
	form.querySelectorAll(".myInput, .myPrice").forEach(function (input) {
		if (input.value.trim() === "") {
			allFieldsFilled = false;
		}
	});

	// التحقق من تحديد البراند
	if (brand.value.trim() === "") {
		allFieldsFilled = false;
	}
	// التحقق من اختيار الصورة عند إنشاء منتج جديد فقط
	if (mode === "create" && !imageSelected) {
		allFieldsFilled = false;
	}

	// السماح بالتحديث حتى لو لم يتم اختيار صورة جديدة
	if (mode === "update") {
		allFieldsFilled = true; // لأن جميع الحقول محملة مسبقًا
	}
	// تمكين أو تعطيل زر الإضافة
	submitButton.disabled = !allFieldsFilled;
}
// عند اختيار الصورة، قم بتحديث حالة التحقق
imgInput.addEventListener("change", function (event) {
	if (event.target.files.length > 0) {
		imageSelected = true;
		checkFormValidity();
	}
});
