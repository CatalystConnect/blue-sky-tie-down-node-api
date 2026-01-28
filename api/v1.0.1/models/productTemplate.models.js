module.exports = (sequelize, DataTypes) => {
  const ProductTemplate = sequelize.define(
    'ProductTemplate',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      template_code: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'product_templates',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ProductTemplate;
};
