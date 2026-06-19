import Validator from "validatorjs";

let rules = {
  email: 'required|email'
}

export function validateUser(data){
    return new Validator(data, rules)

}