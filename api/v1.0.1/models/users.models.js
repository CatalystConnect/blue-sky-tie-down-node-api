module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userType: {
        type: Sequelize.ENUM("internal", "external"),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM("administrator", "admin"),
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      referal: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      chk_password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      remember_token: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      stripe_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pm_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pm_last_four: {
        type: Sequelize.STRING(4),
        allowNull: true,
      },
      trial_ends_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      department_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      userHourlyRate: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
    },
    {
      timestamps: true,       
      paranoid: true,       
      freezeTableName: true,  
      // underscored: true   
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",    
    }
  );
  return users;
};
