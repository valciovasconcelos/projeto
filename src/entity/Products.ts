import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ProductCategory } from "./ProductCategories"
import { ProductSituation } from "./ProductSituations"

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 255 })
    name!: string

    @Column({ nullable: true })
    productSituationId!: number

    @Column({ nullable: true })
    productCategoryId!: number

    @ManyToOne(() => ProductSituation, (productSituation) => productSituation.products)
    @JoinColumn({ name: "productSituationId" })
    productSituation!: ProductSituation

    @ManyToOne(() => ProductCategory, (productCategory) => productCategory.products)
    @JoinColumn({ name: "productCategoryId" })
    productCategory!: ProductCategory

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date
}
