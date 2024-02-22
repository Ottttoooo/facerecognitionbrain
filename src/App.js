import React, {Component} from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from './Components/Navigation/Navigaton';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const regions = data.outputs[0].data.regions;

    const clarifaiFace = regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimg');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col *width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input})
    fetch('https://vast-scrubland-48720-deee0e75a1ba.herokuapp.com/imageUrl', {
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
    .then(response => response.json())
    .then(result => {
      if(!result) throw new Error("Shit went wrong"); 
      this.displayFaceBox(this.calculateFaceLocation(result));
      return fetch('https://vast-scrubland-48720-deee0e75a1ba.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count}))
    })
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  

  render(){
    const { isSignedIn, imgUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#FFFFFF" num={50} type="cobweb" bg={true} />
        <Navigation 
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        { route === 'home'  
        ? <> 
          <Logo />
          <Rank 
            name = {this.state.user.name}
            entries = {this.state.user.entries}
          />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
          />
          <FaceRecognition box={box} imgUrl={imgUrl} />
        </>
        : (
            route === 'signin' || route === 'signout'
            ? <Signin 
              loadUser= {this.loadUser}
              onRouteChange={this.onRouteChange}
            />
            : <Register 
              loadUser= {this.loadUser}
              onRouteChange={this.onRouteChange}
            />
           )
        
        
        }
      </div>
    );
  };
};

export default App;
