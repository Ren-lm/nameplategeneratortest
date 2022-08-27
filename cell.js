function Cell()
{
    this.x;
    this.y ;
    this.w;
    this.h;

    this.localX;
    this.localY;
    this.localW;
    this.localH;

    this.type ;
    this.paddingX = 0;
    this.paddingY = 0;
    this.columnWidth;
    this.parentY;

    this.paddingModifier = 0;

    this.init = function(_x, _y, _w, _h, _type)
    {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.type = _type;
    }

    this.initLocalPositions = function(_x, _y, _w, _h)
    {
        this.localX = _x;
        this.localY = _y;
        this.localW = _w;
        this.localH = _h;
    }

    this.updatePosition = function()
    {
        this.x = this.localX * GLOBAL_COLUMN_WIDTH + this.paddingX;
        this.y = this.localY * GLOBAL_ROW_HEIGHT + this.parentY + this.paddingY;
        this.w = (this.localW  * GLOBAL_COLUMN_WIDTH) - (2*this.paddingX) - this.paddingModifier*this.paddingX;
        this.h = (this.localH  * GLOBAL_ROW_HEIGHT) - (2*this.paddingY) - this.paddingModifier*this.paddingY;
    }

    this.initPadding = function(_paddingX, _paddingY, _paddingModifier)
    {
        this.paddingX = _paddingX;
        this.paddingY = _paddingY;
        this.paddingModifier = _paddingModifier;
    }

    this.initParentWidthAndHeight = function(_width, _height)
    {
        this.columnWidth = _width;
    }

    this.setParentY = function(_parentY)
    {
        this.parentY = _parentY;
    }

    this.tryClick = function(c)
    {
        if (c.mouseX > this.x && c.mouseX < this.x + this.w && c.mouseY > this.y && c.mouseY < this.y + this.h)
            {
                //return true if button pressed
                return true;
                
            }
            //console.log("FAIL: Expected:  X: "+ this.x + " | Y: " + this.y + " | W : " + this.w + " | H : " + this.h);
            //console.log("mouseX : " + c.mouseX + " | mouseY : " + c.mouseY);
            return false;
    }

    this.tryHover = function(c)
    {
        if (c.mouseX > this.x && c.mouseX < this.x + this.w && c.mouseY > this.y && c.mouseY < this.y + this.h)
        {
            //return true if hovering
            return true;

        }
        //console.log("FAIL: Expected:  X: "+ this.x + " | Y: " + this.y + " | W : " + this.w + " | H : " + this.h);
        //console.log("mouseX : " + c.mouseX + " | mouseY : " + c.mouseY);
        return false;
    }

}