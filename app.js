function convertToHex() {
    var imageUrl = document.getElementById("imageUrl").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", imageUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.status === 200) {
            var reader = new FileReader();
            reader.onload = function () {
                var arrayBuffer = reader.result;
                var bytes = new Uint8Array(arrayBuffer);
                var hexArray = [];
                for (var i = 0; i < bytes.length; i++) {
                    hexArray.push(bytes[i].toString(16).padStart(2, '0'));
                }
                var hexString = hexArray.join('');
                document.getElementById("hexData").value = hexString;
            };
            reader.readAsArrayBuffer(xhr.response);
        }
    };
    xhr.send();
}

function copyToClipboard() {
    var hexData = document.getElementById("hexData");
    hexData.select();
    document.execCommand("copy");
    alert("Hexadecimal data copied to clipboard!");
}

function convertToImage() {
    var hexString = document.getElementById("hexData").value;
    var bytes = new Uint8Array(hexString.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
    var blob = new Blob([bytes], {type: "image/jpeg"});
    var imageUrl = URL.createObjectURL(blob);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.onload = function () {
        var width = 200; // Set your desired width here
        var scaleFactor = width / img.width;
        var height = img.height * scaleFactor;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        var compressedImageUrl = canvas.toDataURL("image/jpeg");
        var link = document.createElement("a");
        link.href = compressedImageUrl;
        link.download = "compressed_image.jpg";
        link.click();
    };
    img.src = imageUrl;
}