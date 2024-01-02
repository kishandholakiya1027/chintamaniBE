import * as express from 'express';
import { Cteate_Contact } from '../Controller/Contact/Create_Contact';
import { Fetch_active_Contact } from '../Controller/Contact/Fetch_active_contact';
import { Fetch_Inactive_Contact } from '../Controller/Contact/Fetch_Inactive_contact';
import { Contact_create_validator, Fetch_Contact_validator, Remove_Contact_validator, Update_Contact_validator } from '../Validator/ContactValidator';
import { Remove_active_Contact } from '../Controller/Contact/remove_contact';
import { Update_active_Contact } from '../Controller/Contact/update_inactive_contact';

const Routes = express.Router();

Routes.post(
    "/create",
    Contact_create_validator,
    Cteate_Contact
);

Routes.get(
    "/active",
    Fetch_Contact_validator,
    Fetch_active_Contact
);

Routes.get(
    "/inactive",
    Fetch_Contact_validator,
    Fetch_Inactive_Contact
);

Routes.delete(
    "/remove/:contactid",
    Remove_Contact_validator,
    Remove_active_Contact
);

Routes.patch(
    "/update",
    Update_Contact_validator,
    Update_active_Contact
);


export default Routes;