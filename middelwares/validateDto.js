

function validateDto(schema,type = 'body') {

    return (req, res, next) => {
        // Debug: log what we're validating
        console.log('Validating:', type, JSON.stringify(req[type], null, 2));
        console.log('Type of req[type]:', typeof req[type]);
        console.log('Keys in req[type]:', req[type] ? Object.keys(req[type]) : 'null/undefined');
        
        const { error, success } = schema.safeParse(req[type]);
        if (!success) {
            // Log full error details for debugging
            console.log('Validation error details:', JSON.stringify(error.issues, null, 2));
            
            // Fix: error.issues is an array, not a JSON string
            const errorMessages = error.issues.map(issue => {
                const field = issue.path.length > 0 ? issue.path.join('.') : 'unknown';
                return `${field}: ${issue.message}`;
            });
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: errorMessages
            });
        }
        next();
    }

}


export default validateDto;