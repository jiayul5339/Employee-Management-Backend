// ...allowedRoles allows us to pass in as many roles as we want
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles]; // Roles we look for to determine if user has access
        // We are comparing the roles available, to the roles that are passed in
        console.log(rolesArray);
        console.log(req.roles);

        // We compare the roles with the roles the user is assigned to
        // We map over the roles and compare it to the rolesArray. This will return true if a match is found
        const result = req.roles.map(role => rolesArray.includes(role)).find((value) => value === true)
        console.log(result)
        // If no roles match, it isn't authorized
        if (!result) return res.sendStatus(401);

        next();
    }
}

module.exports = verifyRoles