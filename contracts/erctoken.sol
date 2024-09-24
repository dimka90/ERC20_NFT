// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ERC20{
    string private _name = "Dollar";
    string private  _symbol = "USDT";
    uint8 private  _decimals = 18;
    uint256 private _totalSupply;
    // uint constant SCALE =  10 ** 18;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;

   

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Allowance(address indexed owner, address indexed spender,uint value);


    constructor (uint initialSupply){
        _totalSupply = initialSupply;
        balances[msg.sender]=_totalSupply;
    
        emit Transfer(address(0), msg.sender,_totalSupply);


    }
    function totalSupply() view external  returns(uint) {
        return _totalSupply;
    }

    function symbol() view  external returns (string memory) 
{
return  _symbol;
}
function decimal() view  external  returns (uint)   {
    return _decimals;
}
function _balanceOf(address account) view  external returns (uint) 
{
    return balances[account];
}
function transfer(address to, uint amount)external returns(bool)
{
    require(to!= address(0),"Address zero is not valid");
    require(balances[msg.sender] >=  amount, "Insuffienct token");
    // upadate state vairabl

    balances[msg.sender] -= amount;
    balances[to] += amount  ;
    emit Transfer(msg.sender, to, amount);
     return true;

}
function approve(address spender, uint amount ) external  returns (bool)
{
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
}

function allowances(address owner, address spender) view external returns(uint)
{
  
    return allowance[owner][spender];

}
function transferFrom(address owner, address spender, uint amount) external returns(bool)
{
    // check the balance of the owner

    require(spender != address(0),"Address zero is not valid");
    // require(balances[owner]>= amount, "Insufficient fund");
    require(allowance[owner][spender]>= amount, "No token attached to this account");

    // update the state vairables
    balances[owner]-= amount ;
    balances[spender] += amount;

    allowance[owner][spender] -= amount;

    emit Transfer(owner, spender, amount);
 return true;   
}
}