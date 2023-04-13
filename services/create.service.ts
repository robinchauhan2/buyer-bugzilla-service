import axiosInstance from "utils/AxiosInstance";

enum Severity { Enhancement, Normal, Minor, Major, Blocker, Critical, Trival }

interface ICreateBug {
    product: "TestProduct",
    component: "TestComponent",
    version: "unspecified",
    summary: string,
    alias: string,
    priority: Severity,
    op_sys: "All",
    rep_platform: "All"
}

class CreateBugService {

    async createBug(data: ICreateBug) {
        try {
            const response = await axiosInstance.post("/rest/bug", data)
            return response;
        } catch (error) {
            console.log("file: create.service.ts:27 ~ CreateService ~ createBug ~ error:", error)
            return error

        }
    }

}

export default CreateBugService