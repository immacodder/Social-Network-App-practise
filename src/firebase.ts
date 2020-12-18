import firebase from 'firebase'

const firebaseConfig = {
	apiKey: 'AIzaSyB8JoksvFAwDaOv_DbgFQu64xct0-6iBkE',
	authDomain: 'social-network-app-dev.firebaseapp.com',
	projectId: 'social-network-app-dev',
	storageBucket: 'social-network-app-dev.appspot.com',
	messagingSenderId: '1017258496636',
	appId: '1:1017258496636:web:b3229565a66decc4746ff9'
}
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig)
else firebase.app()

export default firebase
