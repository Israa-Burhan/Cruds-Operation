var inputs = document.querySelectorAll(".myInput");
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var taxes = document.getElementById("taxes");
var ads = document.getElementById("ads");
var discount = document.getElementById("discount");
var count = document.getElementById("count");
var total = document.getElementById("total");
var cate = document.getElementById("category");
var submitButton = document.getElementById("addProduct");
var form = document.getElementById("productForm");
var tbody = document.getElementById("tbody");
var brand = document.getElementById("brand");
var productImage = document.getElementById("productImage");
var chooseImageButton = document.getElementById("chooseImageButton");
var imageBase64 = ""; // لتخزين الصورة
var mode = "create"; // متغير لتحديد الحالة (إضافة أو تحديث)
var tempIndex; // لتخزين فهرس العنصر الذي يتم تعديله
// الحقل يتغير لونه عند الكتابة
inputs.forEach((input) => {
	input.addEventListener("input", function () {
		if (input.value.trim() !== "") {
			input.classList.add("changed"); // عند الكتابة يتغير اللون ويبقى ثابتًا
		} else {
			input.classList.remove("changed"); // إذا كان الحقل فارغًا، يعود إلى اللون الافتراضي
		}
	});
});
var imageSelected = false;
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
productImage.addEventListener("change", function (event) {
	if (event.target.files.length > 0) {
		imageSelected = true;
		checkFormValidity();
	}
});
// عند الضغط على زر الإضافة، إضافة المنتج
form.addEventListener("submit", function (event) {
	event.preventDefault(); // منع الإرسال الافتراضي للنموذج
	addProduct(productContainer); // تنفيذ عملية الإضافة

	imageSelected = false;
	checkFormValidity(); // تحديث حالة الزر بعد الإضافة
});
// //get products from localStorage
var productContainer;
if (localStorage.getItem("products")) {
	productContainer = JSON.parse(localStorage.getItem("products"));
} else {
	productContainer = [];
}
displayProducts(productContainer);
updateTotalProducts();

// //add product
function addProduct() {
	console.log("Image Base64 before saving: ", imageBase64); //

	var product = {
		name: productName.value,
		price: productPrice.value,
		taxes: taxes.value,
		ads: ads.value,
		discount: discount.value,
		count: count.value || 1,
		total: total.textContent,
		cate: cate.value,
		image: imageBase64,
		brand: brand.value,
	};
	if (mode === "create") {
		// إضافة منتج جديد
		productContainer.push(product);
	} else {
		// تحديث المنتج الحالي
		productContainer[tempIndex] = product;
		mode = "create"; // إعادة الوضع إلى "إضافة"
		submitButton.innerHTML = " Add Product"; // إرجاع زر الإضافة لحالته الأصلية
		submitButton.style.background = ""; // إزالة اللون الخاص بالتحديث
	}
	console.log(product);
	localStorage.setItem("products", JSON.stringify(productContainer));
	displayProducts(productContainer);
	updateTotalProducts();
	clearInputs();
}
function clearInputs() {
	form.reset();
	checkFormValidity(); // إعادة التحقق من الحقول بعد مسحها
}
// //display products in table
// display products in table
function displayProducts(productlist) {
	var box = "";
	for (var i = 0; i < productlist.length; i++) {
		box += `<tr>
						<td class="order">${i + 1}</td>
						<td>${productlist[i].name}</td>
						<td>${productlist[i].price}</td>
		<td><img src="${
			productlist[i].image
		}" class="img-thumbnail" width="65px" style="max-width: 100px;"></td>
            <td>${productlist[i].taxes}</td>
            <td>${productlist[i].ads}</td>
            <td>${productlist[i].discount}</td>
            <td>${productlist[i].total}</td>
						<td>${productlist[i].cate}</td>
            <td>${productlist[i].brand}</td>
            <td>${productlist[i].count}</td>
						<td><button onclick="updatecount(${i},${1})" class="incCount"><i class="fas fa-plus-circle"></i></button></td>
						<td><button onclick="updatecount(${i},${-1})" class="decCount"><i class="fas fa-minus-circle"></i></button></td>
						<td><button onclick="updatepro(${i})" class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button></td>
						<td><button onclick="deletProduct(${i})" class="deleteBtn"><i class="fa-solid fa-trash"></i></button></td>
					</tr>`;
	}
	tbody.innerHTML = box;

	//delete all
	var btndeleteall = document.getElementById("deleteall");
	if (productContainer.length > 0) {
		btndeleteall.innerHTML = `<button onclick="deleteall()">Delete All </button>`;
	} else {
		btndeleteall.innerHTML = "";
	}
	getTotal();
}

//get image
// productImage.addEventListener("change", function () {
// 	let file = this.files[0]; // الحصول على الملف
// 	if (file) {
// 		let reader = new FileReader();
// 		reader.readAsDataURL(file); // تحويل الصورة إلى Base64
// 		reader.onload = function () {
// 			imageBase64 = reader.result; // حفظ Base64
// 		};
// 	}
// });
document
	.getElementById("chooseImageButton")
	.addEventListener("click", function () {
		productImage.click(); // محاكاة الضغط على input[type="file"]
	});
productImage.addEventListener("change", function () {
	let file = this.files[0]; // الحصول على الملف
	if (file) {
		let reader = new FileReader();
		reader.readAsDataURL(file); // تحويل الصورة إلى Base64
		reader.onload = function () {
			imageBase64 = reader.result; // حفظ Base64
			console.log("Image Base64: ", imageBase64); // تحقق من Base64
			document.getElementById("previewImage").src = imageBase64; // عرض الصورة في المعاينة
			document.getElementById("imageName").textContent = file.name;
			document.getElementById("imagePreviewContainer").style.display = "flex"; // إظهار حاوية المعاينة
		};
	}
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
	cate.value = "";
	brand.value = "";
	imageBase64 = "";
	document.getElementById("imagePreviewContainer").style.display = "none"; // إخفاء المعاينة بعد المسح
}

// //delete product
// function deletProduct(index) {
// 	productContainer.splice(index, 1);
// 	localStorage.setItem("products", JSON.stringify(productContainer)); // حفظ التغييرات
// 	displayProducts(productContainer);
// }
function deletProduct(index) {
	let confirmBox = document.getElementById("confirmBox");
	confirmBox.style.display = "block"; // إظهار نافذة التأكيد

	document.getElementById("confirmYes").onclick = function () {
		productContainer.splice(index, 1);
		localStorage.setItem("products", JSON.stringify(productContainer));
		displayProducts(productContainer);
		updateTotalProducts();
		confirmBox.style.display = "none"; // إخفاء النافذة بعد الحذف
	};

	document.getElementById("confirmNo").onclick = function () {
		confirmBox.style.display = "none"; // إخفاء النافذة بدون حذف
	};
}

// //increment decrement count
function updatecount(index, x) {
	if (productContainer[index].count == 0 && x == -1) {
		productContainer[index].count = 0;
	} else {
		productContainer[index].count =
			Number(productContainer[index].count) + Number(x);
	}
	localStorage.setItem("products", JSON.stringify(productContainer)); // حفظ التعديلات
	displayProducts(productContainer);
}
// //getTotal
function getTotal() {
	if (productPrice.value.trim() !== "") {
		var result =
			(+productPrice.value || 0) +
			(+taxes.value || 0) +
			(+ads.value || 0) -
			(+discount.value || 0);

		total.textContent = result; // ✅ تحديد رقمين عشريين
		total.style.background = "#040";
	} else {
		total.textContent = "";
		total.style.background = "#d0d0d0";
	}
}

// //update product

function updatepro(index) {
	// تعبئة الحقول بقيم المنتج المحدد
	productName.value = productContainer[index].name;
	productPrice.value = productContainer[index].price;
	taxes.value = productContainer[index].taxes;
	ads.value = productContainer[index].ads;
	discount.value = productContainer[index].discount;
	cate.value = productContainer[index].cate;
	brand.value = productContainer[index].brand;

	getTotal();
	count.value = productContainer[index].count;

	if (productContainer[index].image) {
		document.getElementById("previewImage").src = productContainer[index].image;
		document.getElementById("imagePreviewContainer").style.display = "flex"; // إظهار المعاينة
		imageBase64 = productContainer[index].image; // حفظ الصورة في متغير الصورة قبل التحديث
	}

	// تغيير زر الإضافة إلى "تحديث"
	submitButton.innerHTML = "Update Product";
	submitButton.style.background = "#f39c12"; // لون مميز للزر عند التحديث
	mode = "update"; // تغيير الحالة إلى "تحديث"
	tempIndex = index; // تخزين فهرس المنتج المراد تعديله

	checkFormValidity();
	// التمرير للأعلى لضمان رؤية النموذج
	scroll({
		top: 0,
		behavior: "smooth",
	});
}
console.log("Image Base64: ", imageBase64);
//delete all
function deleteall() {
	localStorage.clear();
	productContainer.splice(0);
	displayProducts(productContainer);
	updateTotalProducts();
}

//search
function searchProduct(term) {
	var searchProduct = [];
	for (var i = 0; i < productContainer.length; i++) {
		if (productContainer[i].name.toLowerCase().includes(term.toLowerCase())) {
			searchProduct.push(productContainer[i]);
		}
	}
	displayProducts(searchProduct);
}

//get total products
function updateTotalProducts() {
	document.getElementById("totalProducts").textContent =
		productContainer.length;
}
