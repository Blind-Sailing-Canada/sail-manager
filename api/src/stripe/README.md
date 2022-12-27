The webhook will read the metadata from
 1. payment session first
 2. line item if session does not contain the metadata

You can set the meta data on a product or on payment link.

Metadata set in payment link will overright the metadata in the product.

> number_of_sails_included = number  
> number_of_guest_sails_included = number  
> is_unlimited_sails = true|false  
> product_type = guest_sail|membership|sail_package|single_sail|donation  
> valid_until = mm/dd/yyyy  

example:

> number_of_sails_included = 10  
> product_type = sail_package  
> valid_until = 12/31/2023  

Will give 10 sails, 0 guest sails, and expires on December 31, 2023.

example:

> number_of_sails_included = 1  
> product_type = single_sail  

Will give 1 sail.

example:

> number_of_guest_sails_included = 1  
> product_type = guest_sail  

Will give 1 guest sail.
