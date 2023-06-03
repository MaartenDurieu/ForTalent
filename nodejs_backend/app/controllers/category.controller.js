const db = require("../models");
const Category = db.category;

// returns all categories
exports.getCategories = (req, res) => {
    Category.findAll().then(l => {
        let r = {}
        let other = [];
        l.forEach(x => {
            if (!x.type)
               other.push(x.name);
            else if (x.type in r)
                r[x.type].push(x.name)
            else
                r[x.type] = [x.name]
        });
        r['Other'] = other
        res.status(200).send(r)
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};

/** create category
 * expected params in body
 * @param name
 * @param type
 */
exports.createCategory = (req, res) => {
    Category.create({
        name: req.body.name,
        type: req.body.type
    }).then(c => {
        res.send({message: "Category created successfully"})
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};

/** delete category
 * expected param in body
 * @param name
 */
 exports.deleteCategory = (req, res) => {
    Category.findOne({
        where: {
            name: req.body.name
        }
    }).then(c => {
        if (!c)
            return res.status(404).send({ message: "Invalid Category name" });
        c.destroy().then(_ => res.send({message: "Category deleted successfully"}))
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};

/** delete category
 * expected param in body
 * @param type
 */
exports.deleteCategoryType = (req, res) => {
    Category.findAll({
        where: {
            type: req.body.type
        }
    }).then(c => {
        if (c.length === 0)
            return res.status(404).send({ message: "No categories found with type" });
        let remainingDeletions = c.length;
        c.forEach(x => {
            x.destroy().then(_ => {
                if (remainingDeletions === 1)
                    res.send({message: "All categories with type successfully deleted!"})
                else
                    remainingDeletions -= 1;
            })
        })
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
}