# RegistrAPP

## Descripción

**RegistrAPP** es una aplicación móvil desarrollada para facilitar el registro de asistencia de los alumnos en clases presenciales. Dada la situación actual de la pandemia, donde las instituciones de educación superior han tenido que adaptarse a la modalidad remota y luego regresar a la presencialidad, se identificaron múltiples dificultades en el registro de asistencia. Con el objetivo de resolver esta problemática, se creó esta aplicación para permitir que cada alumno registre su propia asistencia de manera eficiente y precisa.

### Problemas Identificados

- Múltiples tareas del docente durante la clase.
- Falta de tiempo adecuado para registrar asistencia.
- Dificultad para reconocer a los alumnos debido a las mascarillas.
- Olvido por parte del docente de realizar el registro de asistencia.

## Tecnologías Utilizadas

- **Ionic**
- **Angular**
- **Firebase**

## Instalación

Para instalar y ejecutar el proyecto en tu máquina local, sigue estos pasos:

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/CreminoPanda/Registrapp-Duoc.git
   ```

2. **Navega al directorio del proyecto**

   ```bash
   cd Registrapp-Duoc
   ```

3. **Instala las dependencias**

   Asegúrate de tener instalado Node.js y npm. Luego, ejecuta:

   ```bash
   npm install
   ```

4. **Configura Firebase**

   - Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com/).
   - Agrega una nueva aplicación web y copia la configuración de Firebase.
   - Crea un archivo `environment.ts` en la carpeta `src/environments` y agrega la configuración de Firebase:

   ```typescript
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID",
     },
   };
   ```

5. **Ejecuta la aplicación**

   Para iniciar la aplicación en modo de desarrollo, ejecuta:

   ```bash
   ionic serve
   ```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir a este proyecto, por favor abre un issue o envía un pull request.
