import { Status, User, UserRole } from "../entities/UserModel"
import { getRepository } from "typeorm"
import { bcryptpassword } from "./bcrypt"

export const CreateAdmin = async (data: any) => {
    try {
        const { firstname = "chintamani", lastname = "jems", password = "Admin@123", email = "jemsvala@mailinator.com" } = data

        const UserRepo = getRepository(User)

        const oldAdmin = await UserRepo.findOne({ where: { email: email, status: Status.ACTIVE } })
        if (!oldAdmin) {

            const hashedPassword = await bcryptpassword(password)

            const AdminData = await UserRepo.create({
                firstname: firstname,
                lastname: lastname,
                password: hashedPassword,
                email: email,
                role: UserRole.Admin,
            })

            await UserRepo.save(AdminData)
                .then(data => {
                    console.log("Admin Created Success")
                })
                .catch(err => {
                    console.log(err)
                })

        } else {
            console.log("Admin Alredy Exis")
        }
    } catch (error) {
        console.log(error, "error")
    }
}