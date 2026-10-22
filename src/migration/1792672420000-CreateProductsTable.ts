import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductsTable1792672420000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "productSituationId",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "productCategoryId",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));

        // Chave estrangeira para product_situations
        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["productSituationId"],
                referencedTableName: "product_situations",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL"
            })
        );

        // Chave estrangeira para product_categories
        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["productCategoryId"],
                referencedTableName: "product_categories",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        const fkSituation = table?.foreignKeys.find((fk) => fk.columnNames.includes("productSituationId"));
        if (fkSituation) await queryRunner.dropForeignKey("products", fkSituation);

        const fkCategory = table?.foreignKeys.find((fk) => fk.columnNames.includes("productCategoryId"));
        if (fkCategory) await queryRunner.dropForeignKey("products", fkCategory);

        await queryRunner.dropTable("products");
    }

}
