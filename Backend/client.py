class Client():
    def __init__(self, row):
        self._id = row[0]
        self._nombre = row[1]
        self._apellido = row[2]
        self._dni = row[3]
    def to_json(self):
        return {
            "id" : self._id,
            "nombre" : self._nombre,
            "apellido" : self._apellido,
            "dni" : self._dni
        }