const mongoose =require("mongoose")

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true,"name is required"],
		},
		username: {
			type: String,
			required: [true,"username is required"],
			unique: true,
		},
		email: {
			type: String,
			required:[ true,"email is required"],
			unique: true,
		},
		password: {
			type: String,
			minLength: [6,"Password should be minimum 6 characters"],
			required: [true,"Password is required"],
		},
		profilePic: {
			type: String,
			default: "",
		},
		followers: {
			type: [String],
			default: [],
		},
		following: {
			type: [String],
			default: [],
		},
		bio: {
			type: String,
			default: "",
		},
		isFrozen: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

module.exports=User