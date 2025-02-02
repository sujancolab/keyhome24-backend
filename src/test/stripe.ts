import { payForUpload } from "@Services/stripe";

console.log(await payForUpload(1, "property-15days", 3));
