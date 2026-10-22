import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Product } from "./Products"

@Entity("product_categories")
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 255 })
    name!: string

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date

    @OneToMany(() => Product, (product) => product.productCategory)
    products!: Product[]
}
