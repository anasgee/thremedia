
import { useState } from "react";
import useShowToast from "./showToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();

	
	// const handleImageChange = (e) => {
	// 	const file = e.target.files[0];
	// 	if (file && file.type.startsWith("image/")) {
	// 		const reader = new FileReader();

	// 		reader.onloadend = () => {
	// 			setImgUrl(reader.result);
	// 		};

	// 		reader.readAsDataURL(file);
	// 	} else {
	// 		showToast("Invalid file type", " Please select an image file", "error");
	// 		setImgUrl(null);
	// 	}
	// };
	

	const handleImageChange = (e) => {
		const file = e.target.files[0]; // Get the first file from the input
	  
		if (file && file.type.startsWith('image/')) { // Check if the file exists and is an image
		  const reader = new FileReader();
		  
		  reader.onload = () => {
			setImgUrl(reader.result); // Set the image URL once it's loaded
		  };
	  
		  reader.readAsDataURL(file); // Read the file as a data URL to display it
		} else {
			showToast("Invalid file type", "Please select an image file", "error");

		  // If no file is selected or the file is not an image, handle this case (optional)
		  setImgUrl(null); // C lear imgUrl if the selected file is not valid
		}
	  };


	console.log(imgUrl)
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;



// import { useState } from "react";
// import useShowToast from "./showToast";

// const usePreviewImg = () => {
//   const [imgUrl, setImgUrl] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
//   const showToast = useShowToast();

//   const handleFileSelection = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file); // Store the file in state
//     }
//   };

//   const handleImageChange = () => {
//     if (selectedFile && selectedFile.type.startsWith("image/")) {
//       const reader = new FileReader();

//       reader.onload = () => {
//         setImgUrl(reader.result); // Set the image URL once it's loaded
//       };

//       reader.readAsDataURL(selectedFile); // Read the file as a data URL to display it
//     } else {
//       showToast("Invalid file type", "Please select an image file", "error");
//       setImgUrl(null); // Clear imgUrl if the selected file is not valid
//     }
//   };

//   console.log(imgUrl);
//   return { handleFileSelection, handleImageChange, imgUrl, setImgUrl };
// };

// export default usePreviewImg;
