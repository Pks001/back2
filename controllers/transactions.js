import transaction from "../models/createCollection.js"

const response  = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
const data = await response.json()
// console.log(data)

const createTransaction = async () => {
    for (let i = 0; i<data.length; i++){
        const product = new transaction({
            id: data[i].id,
            title: data[i].title,
            price: data[i].price,
            description: data[i].description,
            category: data[i].category,
            image: data[i].image,
            sold: data[i].sold,
            dateOfSale: data[i].dateOfSale
        })
        try{
            const saveProduct = await product.save();
            //console.log(saveProduct)
        }
        catch(err){
            console.log(err)
        }
    }
}



export const getAllProducts = async (req, res) => {
    try{
        const {page, search, month, perPage} = req. query;
        const monthMap = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12
        };
        
        const monthNumber = monthMap[month];

        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            }, 
            category : {$regex : search},
        };

        const offset = (page - 1)*perPage

        const products = await transaction.find(query).skip(offset).limit(perPage);
        res.send(products)
    }
    catch(err){
        console.log(err.message)
    }
}

export const getAllSalesMonthProducts = async (req, res) => {
    try{

        const map1 = new Map();
        map1.set("January", "0");
        map1.set("February", "1");
        map1.set("March", "2");
        map1.set("April", "3");
        map1.set("May", "4");
        map1.set("June", "5");
        map1.set("July", "6");
        map1.set("August", "7");
        map1.set("September", "8");
        map1.set("October", "9");
        map1.set("November", "10");
        map1.set("December", "11");
        
        var search = req.query.month;
        //console.log(search)

        let monthNum = map1.get(search)
        monthNum = Number(monthNum)
        //console.log(typeof(monthNum))
        

        const data = await transaction.find();
        //console.log(data)

        //search.toString();

        let sales = 0;
        let soldItems = 0;
        let totalItems = 0;
        for (let i = 0; i < data.length; i++) {
            let originalString = data[i].dateOfSale;

            const mon = originalString.getMonth()
            //console.log(mon)
            //console.log(typeof(mon))

            //console.log(typeof(originalString))
            //console.log(originalString)

            
            // originalString = originalString.toString();
            //console.log(originalString)

            //console.log(typeof(originalString))

            //let text = originalString.substring(5, 7);
            //console.log(text, text)

            //console.log(typeof(map1.get(search)))
            //console.log(text == map1.get(search))

            //console.log(Number(map1.get(search)))

            let sold = data[i].solid;
            if (mon == Number(map1.get(search))) {
                sales += data[i].price;
                totalItems += 1;
                if (sold == true)
                    soldItems += 1;
            }
        }
        const details = {
            sales : sales,
            soldItems : soldItems,
            notSoldItems : totalItems - soldItems,
        }
        res.send(details)
        //res.send(`The Total Sale in this month: ${ sales }, The Total Number of Sales in this month: ${ soldItems }, Total number of not sold items of selected month: ${totalItems-soldItems}`);
    }
    catch(err){
        console.log(err.message);
    }
}

export const getBarChartProducts = async (req, res) => {
    try{

        const data = await transaction.find();

        const map1 = new Map();
        map1.set("January", "0");
        map1.set("February", "1");
        map1.set("March", "2");
        map1.set("April", "3");
        map1.set("May", "4");
        map1.set("June", "5");
        map1.set("July", "6");
        map1.set("August", "7");
        map1.set("September", "8");
        map1.set("October", "9");
        map1.set("November", "10");
        map1.set("December", "11");
        var search = req.query.month;
        search.toString();
    
        const map2 = new Map();
        map2.set(100, 0);
        map2.set(200, 0);
        map2.set(300, 0);
        map2.set(400, 0);
        map2.set(500, 0);
        map2.set(600, 0);
        map2.set(700, 0);
        map2.set(800, 0);
        map2.set(900, 0);
        map2.set(901, 0);
        // Group transactions by price range
        for (let i = 0; i < data.length; i++) {
            let originalString = data[i].dateOfSale;
            let sold = data[i].solid;
            let text = originalString.getMonth()
            //console.log(text)
            if (text == Number(map1.get(search))) {
                if (data[i].price < 100)
                    map2.set(100, map2.get(100) + 1);
                else if (data[i].price < 200)
                    map2.set(200, map2.get(200) + 1);
                else if (data[i].price < 300)
                    map2.set(300, map2.get(300) + 1);
                else if (data[i].price < 400)
                    map2.set(400, map2.get(400) + 1);
                else if (data[i].price < 500)
                    map2.set(500, map2.get(500) + 1);
                else if (data[i].price < 600)
                    map2.set(600, map2.get(600) + 1);
                else if (data[i].price < 700)
                    map2.set(700, map2.get(700) + 1);
                else if (data[i].price < 800)
                    map2.set(800, map2.get(800) + 1);
                else if (data[i].price < 900)
                    map2.set(900, map2.get(900) + 1);
                else
                    map2.set(901, map2.get(901) + 1);
            }
        }
        //console.log(map2)
        res.json(Array.from(map2.entries()));
        // res.setHeader('Content-Type', 'text/html');
        // res.write(`<h2>Price range and the number of items in that range for the selected month regardless of the year</h2>`);
        // for (let [key, value] of map2) {
        //     res.write("< " + key + " = " + value + `<br/>`);
        //     //console.log("<" + key + "=" + value);
        // }
    }
    catch(err){
        console.log(err.message)
    }
}

export const getPichartProducts = async (req, res) => {
    try{
            const data = await transaction.find();

            const map1 = new Map();
            map1.set("January", "0");
            map1.set("February", "1");
            map1.set("March", "2");
            map1.set("April", "3");
            map1.set("May", "4");
            map1.set("June", "5");
            map1.set("July", "6");
            map1.set("August", "7");
            map1.set("September", "8");
            map1.set("October", "9");
            map1.set("November", "10");
            map1.set("December", "11");
            var search = req.query.month;
            search.toString();
            // console.log(search);
            // console.log(map1.get(search)); // getting Month Number

            const map2 = new Map();
            for (let i = 0; i < data.length; i++) {
                let originalString = data[i].dateOfSale;
                originalString.toString();
                let text = originalString.getMonth();
                if (text == map1.get(search)) {
                    let category = data[i].category;
                    category.toString();
                    map2.set(category, 0);
                }

            }
            for (let i = 0; i < data.length; i++) {
                let originalString = data[i].dateOfSale;
                let text = originalString.getMonth();
                if (text == Number(map1.get(search))) {
                    let category = data[i].category;
                    // console.log(category);
                    category.toString();
                    map2.set(category, map2.get(category) + 1);
                    // console.log(map2.get(category));
                }
            }

            res.json(Array.from(map2.entries()));
            // res.setHeader('Content-Type', 'text/html');
            // res.write(`<h2>Unique categories and number of items from that category for the selected month</h2>`);
            // for (let [key, value] of map2) {
            //     res.write(key + " category: " + value + `<br/>`);
            //     // console.log(key + " category = " + value);
            // }
        }
    catch(err){
        console.log(err.message)
    }
}