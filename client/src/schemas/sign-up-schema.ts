import { z } from "zod";

export const signUpSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
		),
	confirmPassword: z.string(),
	username: z.string().min(3, "Username must be at least 3 characters long"),
	fullname: z.string().min(3, "Full name must be at least 3 characters long"),
	dateofbirth: z
		.date()
		.max(new Date(), "Date of birth must be in the past")
		.min(new Date("1900-01-01"), "Date of birth must be after 1900-01-01"),
	gender: z.string(),
});
