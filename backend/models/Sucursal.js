const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sucursal = sequelize.define('Sucursal', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'sucursales',
  timestamps: true,
  createdAt: 'createdAt', 
  updatedAt: 'updatedAt' 
});

// Sincronización
Sucursal.sync()
  .then(() => console.log('✅ Modelo Sucursal sincronizado'))
  .catch(err => console.error('❌ Error al sincronizar modelo:', err));

module.exports = Sucursal;