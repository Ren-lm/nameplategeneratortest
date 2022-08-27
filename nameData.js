function NameData(id)
{
    this.id = 0;
    this.enabled = true;
    this.name = "";
    this.subtext = GLOBAL_DEFAULT_SUBTEXT;
    this.color = GLOBAL_DEFAULT_COLOR;
    this.image;
    

    this.setData = function(_id, _enabled, _name, _subtext, _color, _image)
    {
        this.id = _id;
        this.enabled = _enabled;
        this.name = _name;
        this.subtext = _subtext;
        this.color = _color;
        if(_image != null)
        {
            this.image = this.loadImage(_image);
        }
       
        
    }
    
    this.setDefaultImage = function(_image)
    {
        this.image = _image;
    }

    this.loadImage = function(_imagePath)
    {
        imgInput = loadImage(_imagePath);
        return imgInput;
    }
    
    if(GLOBAL_DEFAULT_IMAGE != null)
    {
        this.image = GLOBAL_DEFAULT_IMAGE;
    }
    else
    {
        this.image = this.loadImage("assets/100x100p/27.png");
    }
    

}

