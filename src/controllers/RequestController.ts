import PrismaDriver from "../drivers/PrismaDriver";

export default class RequestController {
  static createRequest = async (
    type: String,
    title_search: String,
    canton: String,
    npa: String,
    city: String,
    budget: String,
    resumption_date: String,
    desired_date: String,
    maximum_costs: String,
    description_search: String
  ) => {
    await PrismaDriver.request.deleteMany({
      where: {
        status: "pending",
      },
    });

    return await PrismaDriver.request.create({
      data: {
        type,
        title_search,
        canton,
        npa,
        city,
        budget,
        resumption_date,
        desired_date,
        maximum_costs,
        location,
        description_search: String,
        
        statdescription_searchus: "pending",
    
      },
    });
  };
}
