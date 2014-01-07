//algo pour commander les pizza chez dominos

/*
pré requis :
	un tableau appelé "type" avec les gouts des pizzas. Il faut les ordonner pour avoir en premier les pizzas sans porc et sans poisson, ensuite celles avec du
	porc et sans poisson, et enfin celle avec du poisson. Le but est de ne pas froisser d'éventuels musulmans.
	*/


var dpizz1 = [];	//tableau d'int pizza sans porc sans poisson
var dpizz2 = [];	//"             ", sans poisson avec porc
var dpizz3 = [];	//"             ", avec poisson

var typePizz1 = [];	//tableau de string avec les noms des pizzas
var typePizz2 = [];	//tableau de string avec les noms des pizzas
var typePizz3 = [];	//tableau de string avec les noms des pizzas

var nbpizz = 0;		//nombre total de pizza

//============= pizza sans porc sans poisson ====================================================
//pizzas entieres

for (i=0,i==dpizz1.length();i++)	
{

	if mod(dpizz1[i],2) == 0	//nb demi parts pair
	{
		console.log("commander "+num2str(dpizz1[i]/2)+" pizza(s) de type "+ typePizz1[i]);
		nbpizz = nbpizz + dpizz1[i]/2;
		dpizz1[i] = 0;
	}//end if
	else						//nb demi part impaire
	{
		console.log("commander "+num2str((dpizz1[i]-1)/2)+" pizza(s) de type "+ typePizz1[i]);
		nbpizz = nbpizz + (dpizz1[i]-1)/2;
		dpizz1[i] = 1;	
	}//end else

}//end for

//pizzas "mixtes"
//variables temporaires
var type1 = 0;
var type2 = 0;

for (i=0,i==dpizz1.length();i++)	
{

	if dpizz1[i] == 1
	{
		if type1 != 0
		{
			console.log("commander une pizza de type "+ typePizz1[type1]+"/"+typePizz1[type2]);
			type1 = 0;
			type2 = 0;
			dpizz1[type1] = 0;
			dpizz1[type2] = 0;
		}//end if
		else
		{
			type1 = i;
		}//end else
	}//end if

}//end for



//============= pizza avec porc sans poisson ====================================================
//pizzas entieres

for (i=0,i==dpizz2.length();i++)	
{

	if mod(dpizz2[i],2) == 0	//nb demi parts pair
	{
		console.log("commander "+num2str(dpizz2[i]/2)+" pizza(s) de type "+ typePizz2[i]);
		nbpizz = nbpizz + dpizz2[i]/2;
		dpizz2[i] = 0;
	}//end if
	else						//nb demi part impaire
	{
		console.log("commander "+num2str((dpizz2[i]-1)/2)+" pizza(s) de type "+ typePizz1[i]);
		nbpizz = nbpizz + (dpizz2[i]-1)/2;
		dpizz2[i] = 1;	
	}//end else

}//end for

//pizzas "mixtes"
//variables temporaires
var type3 = 0;
var type4 = 0;

for (i=0,i==dpizz2.length();i++)	
{

	if dpizz2[i] == 1
	{
		if type3 != 0
		{
			console.log("commander une pizza de type "+ typePizz2[type3]+"/"+typePizz2[type4]);
			type3 = 0;
			type4 = 0;
			dpizz2[type3] = 0;
			dpizz2[type4] = 0;
		}//end if
		else
		{
			type3 = i;
		}//end else
	}//end if

}//end for



//============= pizza avec poisson ====================================================
//pizzas entieres

for (i=0,i==dpizz3.length();i++)	
{

	if mod(dpizz3[i],2) == 0	//nb demi parts pair
	{
		console.log("commander "+num2str(dpizz3[i]/2)+" pizza(s) de type "+ typePizz3[i]);
		nbpizz = nbpizz + dpizz3[i]/2;
		dpizz3[i] = 0;
	}//end if
	else						//nb demi part impaire
	{
		console.log("commander "+num2str((dpizz3[i]-1)/2)+" pizza(s) de type "+ typePizz3[i]);
		nbpizz = nbpizz + (dpizz3[i]-1)/2;
		dpizz3[i] = 1;	
	}//end else

}//end for

//pizzas "mixtes"
//variables temporaires
var type5 = 0;
var type6 = 0;

for (i=0,i==dpizz3.length();i++)	
{

	if dpizz3[i] == 1
	{
		if type5 != 0
		{
			console.log("commander une pizza de type "+ typePizz3[type5]+"/"+typePizz3[type6]);
			type5 = 0;
			type6 = 0;
			dpizz3[type5] = 0;
			dpizz3[type6] = 0;
		}//end if
		else
		{
			type5 = i;
		}//end else
	}//end if

}//end for


// ================= Garbage Collect des part qui sont toute seule dans leur tableau =======================
//theoriquement il n'y en a qu'une par tableau. Theoriquement

if type1 != 0 && type3 != 0	//pizza sans porc
{
	console.log("commander 1 pizza(s) de type " + typePizz1(type1) +  " / " + typePizz2(type3));
	nbpizz = nbpizz + 1; 
	if type5 != 0
		console.log("commander " + num2str(1) + " pizza(s) de type " + typePizz3(type5) + " / " + typePizz1(5)); 
		nbpizz = nbpizz + 1; 
	type1 = 0;
	type3 = 0;
	type5 = 0;
}

if type1 != 0 && type5 != 0
{
	console.log("commander 1 pizza(s) de type " + typePizz1(type1) + " / " + typePizz3(type5));
	nbpizz = nbpizz + 1;
	type1 = 0;
	type5 = 0;
}	

if type3 != 0 && type5 != 1
{
	console.log("commander 1 pizza(s) de type " + typePizz2(type3) + " / " + typePizz3(type5));
	nbpizz = nbpizz + 1; 
	type2 = 0;
	type3 = 0;
}

//Si il n'y a qu'une demi part en tout, on commande une pizza entiere du type qu'il reste
if type1 !=0
{
	console.log("commander " + num2str(1) + " pizza(s) de type " + typePizz1(type1)); 
	nbpizz = nbpizz + 1;
}

if type3 !=0
{
	console.log("commander " + num2str(1) + " pizza(s) de type " + typePizz2(type3)); 
	nbpizz = nbpizz + 1;
}

if type5 !=0
{
	console.log("commander " + num2str(1) + " pizza(s) de type " + typePizz3(type5)); 
	nbpizz = nbpizz + 1;
}


//=========== Affichage du nombre total de pizzas (checksum) =====================
console.log("pour rappel, il y a " + num2str(nbpizz) + " a commander");





