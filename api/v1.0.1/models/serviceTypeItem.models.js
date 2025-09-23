"use strict";

module.exports = (sequelize, DataTypes) => {
  const ServiceTypeItem = sequelize.define(
    "ServiceTypeItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zip_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      service_region: {
        type: DataTypes.STRING(100),
      },
      qty: {
        type: DataTypes.STRING(100),
      },
      per: {
        type: DataTypes.STRING(100),
      },
      tax: {
        type: DataTypes.STRING(100),
      },
      contractor: {
        type: DataTypes.INTEGER,
      },
      uom: {
        type: DataTypes.INTEGER,
      },
      inventory_id: {
        type: DataTypes.INTEGER,
      },
      std_cost: {
        type: DataTypes.INTEGER,
      },
      last_cost: {
        type: DataTypes.INTEGER,
      },
      average_cost: {
        type: DataTypes.INTEGER,
      },
      margin: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      lead_time: {
        type: DataTypes.INTEGER,
      },
      calc_lead_time: {
        type: DataTypes.INTEGER,
      },
      expiration_date: {
        type: DataTypes.DATE,
      },
      effective_date: {
        type: DataTypes.DATE,
      },
      last_sold_date: {
        type: DataTypes.DATE,
      },
      fut_effective_date: {
        type: DataTypes.DATE,
      },
      fut_effective_cost: {
        type: DataTypes.INTEGER,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      isTax: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "serviceTypeItems",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      freezeTableName: true,
    }
  );

  return ServiceTypeItem;
};
