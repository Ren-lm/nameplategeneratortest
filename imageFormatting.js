function ImageFormatting(c) 
{
    this.x;
    this.y;
    this.w;
    this.h;
    this.image;
    this.padding;
    var aspectRatio;
    
    var isHovering;
    
    this.setSize = function(_width, _height)
    {
        this.w = _width;
        this.h = _height;
    }

    this.setPadding = function(_padding)
    {
        this.padding = _padding;
    }
    
    this.setPosition = function(_x, _y)
    {
        this.x = _x;
        this.y = _y;
    }
    
    this.setImage = function(_image)
    {
        this.image = _image;

        aspectRatio = _image.width/_image.height;
    }
    
    this.draw = function()
    {
        
        c.fill(210,210,230);
        c.rect(this.x, this.y, this.w, this.h);
        c.image(this.image, this.x + this.padding, this.y + this.padding, this.w - this.padding*2 , (this.h - this.padding*2) * aspectRatio);
    
        
        if(isHovering)
        {
            c.fill(0,0,100,80);
            c.rect(this.x, this.y, this.w, this.h);
        }
        
    
    }

    this.tryClick = function(c)
    {
        if (c.mouseX > this.x && c.mouseX < this.x + this.w && c.mouseY > this.y && c.mouseY < this.y + this.h)
        {
            //console.log("IMAGE PRESSED: x | " + this.x + "  y | " +this.y );
            
            return true;

        }
       
        return false;
    }

    this.mouseOver = function(c)
    {
        if (c.mouseX > this.x && c.mouseX < this.x + this.w && c.mouseY > this.y && c.mouseY < this.y + this.h)
        {
            // c.fill(0,0,100,50);
            // c.rect(this.x, this.y, this.w, this.y);
            isHovering = true;
            return true;

        }
        isHovering = false;
        return false;
        
    }
    
}
