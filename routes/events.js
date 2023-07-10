const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const {
  getEventos,
  crearEvento,
  editarEvento,
  eliminarEvento,
} = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

// Teiens que pasar por la validacion del jwt
// Obtener eventos
router.get("/", validarJWT, getEventos);

// Crear nuevo evento
router.post(
  "/",
  validarJWT,
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEvento
);

// Actualizar Evento
router.put(
  "/:id",
  validarJWT,
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos,
  ],
  editarEvento
);

// Borrar Evento
router.delete("/:id", validarJWT, eliminarEvento);

module.exports = router;
