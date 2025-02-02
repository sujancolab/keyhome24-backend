import PrismaDriver from "../drivers/PrismaDriver";

export default class ConfigurationController {
    static async getConfiguration() {
        return await PrismaDriver.configuration.findFirst();
    }
}
