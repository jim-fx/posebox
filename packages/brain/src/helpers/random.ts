//     for i in range(L-1):
//         if(type=='xavier'):
//             Theta[i]=(np.sqrt(2/(neurons[i])))*np.random.randn((neurons[i]+1),neurons[i+1])
//         if(type=='zero'):
//             Theta[i]=np.zeros(shape=((neurons[i]+1),neurons[i+1]))
//         if(type=='uniform'):
//             Theta[i]=(2*initEps)*np.random.rand((neurons[i]+1),neurons[i+1])-initEps
//         if(type=='uniformp'):
//             Theta[i]=(initEps)*np.random.rand((neurons[i]+1),neurons[i+1])

function xavier() {
  return;
}

function uniform() {
  return Math.random();
}

function uniformp() {
  return 1 - Math.random() * 2;
}

function int(min, max) {
  return () => Math.floor(min + Math.random() * max);
}

export default { int, xavier, uniform, uniformp };
