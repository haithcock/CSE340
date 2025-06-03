
--1ST QUERY(WORKING)
INSERT INTO public.account (

    
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  ); 
--2ND QUERY(WORKING)
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

--3RD QUERY (WORKING)
DELETE FROM public.account
WHERE account_id = 1;


--4TH QUERY(WORKING)
UPDATE 
    public.inventory
SET
   inv_description = REPLACE (inv_description, 'the small interiors', 'a huge interior')
WHERE 
    inv_id = 10;

--5TH QUERY(WORKING)
SELECT
    inv_make,
    inv_model,
    classification_name
FROM
    public.inventory AS i
INNER JOIN
    public.classification AS c ON i.classification_id = c.classification_id
WHERE 
    classification_name = 'Sport';

--6TH QUERY(WORKING)
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');
