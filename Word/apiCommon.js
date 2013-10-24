// ---------------------------------------------------------------

function CAscColorScheme()
{
    this.Colors = new Array();
    this.Name = "";
}
CAscColorScheme.prototype.get_colors = function() { return this.Colors; }
CAscColorScheme.prototype.get_name = function() { return this.Name; }

// ---------------------------------------------------------------

// ---------------------------------------------------------------

function CAscTexture()
{
    this.Id = 0;
    this.Image = "";
}
CAscTexture.prototype.get_id = function() { return this.Id; }
CAscTexture.prototype.get_image = function() { return this.Image; }

// ---------------------------------------------------------------

function CColor (r,g,b){
    this.r = (undefined == r) ? 0 : r;
    this.g = (undefined == g) ? 0 : g;
    this.b = (undefined == b) ? 0 : b;
}
CColor.prototype.get_r = function(){return this.r}
CColor.prototype.put_r = function(v){this.r = v; this.hex = undefined;}
CColor.prototype.get_g = function(){return this.g;}
CColor.prototype.put_g = function(v){this.g = v; this.hex = undefined;}
CColor.prototype.get_b = function(){return this.b;}
CColor.prototype.put_b = function(v){this.b = v; this.hex = undefined;}
CColor.prototype.get_hex = function()
{
	if(!this.hex)
	{
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		this.hex = ( r.length == 1? "0" + r: r) +
					( g.length == 1? "0" + g: g) +
					( b.length == 1? "0" + b: b);
	}
	return this.hex;
}

// цвет. может быть трех типов:
// COLOR_TYPE_SRGB   : // value - не учитывается
// COLOR_TYPE_PRST   : // value - имя стандартного цвета (map_prst_color)
// COLOR_TYPE_SCHEME : // value - тип цвета в схеме
// sys color - конвертируется в srgb
function CAscColor()
{
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.value = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;

    this.Mods = new Array();
    this.ColorSchemeId = -1;
}
CAscColor.prototype.get_r = function(){return this.r}
CAscColor.prototype.put_r = function(v){this.r = v; this.hex = undefined;}
CAscColor.prototype.get_g = function(){return this.g;}
CAscColor.prototype.put_g = function(v){this.g = v; this.hex = undefined;}
CAscColor.prototype.get_b = function(){return this.b;}
CAscColor.prototype.put_b = function(v){this.b = v; this.hex = undefined;}
CAscColor.prototype.get_a = function(){return this.a;}
CAscColor.prototype.put_a = function(v){this.a = v; this.hex = undefined;}
CAscColor.prototype.get_type = function(){return this.type;}
CAscColor.prototype.put_type = function(v){this.type = v;}
CAscColor.prototype.get_value = function(){return this.value;}
CAscColor.prototype.put_value = function(v){this.value = v;}
CAscColor.prototype.get_hex = function()
{
	if(!this.hex)
	{
		var a = this.a.toString(16);
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		this.hex = ( a.length == 1? "0" + a: a) +
					( r.length == 1? "0" + r: r) +
					( g.length == 1? "0" + g: g) +
					( b.length == 1? "0" + b: b);
	}
	return this.hex;
}

CAscColor.prototype.get_color = function()
{
    var ret = new CColor(this.r, this.g, this.b);
    return ret;
}
// эта функция ДОЛЖНА минимизироваться

function CreateAscColorCustom(r, g, b)
{
    var ret = new CAscColor();
    ret.type = c_oAscColor.COLOR_TYPE_SRGB;
    ret.r = r;
    ret.g = g;
    ret.b = b;
    ret.a = 255;
    return ret;
}

function CreateAscColor(unicolor)
{
    if (null == unicolor || null == unicolor.color)
        return new CAscColor();

    var ret = new CAscColor();
    ret.r = unicolor.RGBA.R;
    ret.g = unicolor.RGBA.G;
    ret.b = unicolor.RGBA.B;
    ret.a = unicolor.RGBA.A;

    var _color = unicolor.color;
    switch (_color.type)
    {
        case COLOR_TYPE_SRGB:
        case COLOR_TYPE_SYS:
        {
            break;
        }
        case COLOR_TYPE_PRST:
        {
            ret.type = c_oAscColor.COLOR_TYPE_PRST;
            ret.value = _color.id;
            break;
        }
        case COLOR_TYPE_SCHEME:
        {
            ret.type = c_oAscColor.COLOR_TYPE_SCHEME;
            ret.value = _color.id;
            break;
        }
        default:
            break;
    }
    return ret;
}
function CorrectUniColor(asc_color, unicolor)
{
    if (null == asc_color)
        return unicolor;

    var ret = unicolor;
    if (null == ret)
        ret = new CUniColor();

    var _type = asc_color.get_type();
    switch (_type)
    {
        case c_oAscColor.COLOR_TYPE_PRST:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_PRST)
            {
                ret.color = new CPrstColor();
            }
            ret.color.id = asc_color.get_value();

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
            break;
        }
        case c_oAscColor.COLOR_TYPE_SCHEME:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME)
            {
                ret.color = new CSchemeColor();
            }

            // тут выставляется ТОЛЬКО из меню. поэтому:
            var _index = parseInt(asc_color.get_value());
            var _id = (_index / 6) >> 0;
            var _pos = _index - _id * 6;

            var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
            ret.color.id = array_colors_types[_id];

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);

            var __mods = g_oThemeColorsDefaultMods;

            if (editor && editor.WordControl && editor.WordControl.m_oDrawingDocument && editor.WordControl.m_oDrawingDocument.GuiControlColorsMap)
            {
                var _map = editor.WordControl.m_oDrawingDocument.GuiControlColorsMap;

                var __r = _map[_id].r;
                var __g = _map[_id].g;
                var __b = _map[_id].b;

                if (__r > 200 && __g > 200 && __b > 200)
                    __mods = g_oThemeColorsDefaultMods1;
                else if (__r < 40 && __g < 40 && __b < 40)
                    __mods = g_oThemeColorsDefaultMods2;
            }

            if (1 <= _pos && _pos <= 5)
            {
                var _mods = __mods[_pos - 1];
                var _ind = 0;
                for (var k in _mods)
                {
                    ret.Mods.Mods[_ind] = new CColorMod();
                    ret.Mods.Mods[_ind].name = k;
                    ret.Mods.Mods[_ind].val = _mods[k];
                    _ind++;
                }
            }

            break;
        }
        default:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB)
            {
                ret.color = new CRGBColor();
            }
            ret.color.RGBA.R = asc_color.get_r();
            ret.color.RGBA.G = asc_color.get_g();
            ret.color.RGBA.B = asc_color.get_b();
            ret.color.RGBA.A = asc_color.get_a();

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
        }
    }
    return ret;
}
// ---------------------------------------------------------------

// заливка -------------------------------------------------------
function CAscFillBlip()
{
    this.type = c_oAscFillBlipType.STRETCH;
    this.url = "";
    this.texture_id = null;
}
CAscFillBlip.prototype.get_type = function(){return this.type}
CAscFillBlip.prototype.put_type = function(v){this.type = v;}
CAscFillBlip.prototype.get_url = function(){return this.url;}
CAscFillBlip.prototype.put_url = function(v){this.url = v;}
CAscFillBlip.prototype.get_texture_id = function(){return this.texture_id;}
CAscFillBlip.prototype.put_texture_id = function(v){this.texture_id = v;}

function CAscFillSolid()
{
    this.color = new CAscColor();
}
CAscFillSolid.prototype.get_color = function(){return this.color}
CAscFillSolid.prototype.put_color = function(v){this.color = v;}

function CAscFillHatch()
{
    this.PatternType = undefined;
    this.fgClr = undefined;
    this.bgClr = undefined;
}
CAscFillHatch.prototype.get_pattern_type = function(){return this.PatternType;}
CAscFillHatch.prototype.put_pattern_type = function(v){this.PatternType = v;}
CAscFillHatch.prototype.get_color_fg = function(){return this.fgClr;}
CAscFillHatch.prototype.put_color_fg = function(v){this.fgClr = v;}
CAscFillHatch.prototype.get_color_bg = function(){return this.bgClr;}
CAscFillHatch.prototype.put_color_bg = function(v){this.bgClr = v;}

function CAscFillGrad()
{
    this.Colors = undefined;
    this.Positions = undefined;
    this.GradType = 0;

    this.LinearAngle = undefined;
    this.LinearScale = true;

    this.PathType = 0;
}
CAscFillGrad.prototype.get_colors = function(){return this.Colors;}
CAscFillGrad.prototype.put_colors = function(v){this.Colors = v;}
CAscFillGrad.prototype.get_positions = function(){return this.Positions;}
CAscFillGrad.prototype.put_positions = function(v){this.Positions = v;}
CAscFillGrad.prototype.get_grad_type = function(){return this.GradType;}
CAscFillGrad.prototype.put_grad_type = function(v){this.GradType = v;}
CAscFillGrad.prototype.get_linear_angle = function(){return this.LinearAngle;}
CAscFillGrad.prototype.put_linear_angle = function(v){this.LinearAngle = v;}
CAscFillGrad.prototype.get_linear_scale = function(){return this.LinearScale;}
CAscFillGrad.prototype.put_linear_scale = function(v){this.LinearScale = v;}
CAscFillGrad.prototype.get_path_type = function(){return this.PathType;}
CAscFillGrad.prototype.put_path_type = function(v){this.PathType = v;}

function CAscFill()
{
    this.type = null;
    this.fill = null;
    this.transparent = null;
}
CAscFill.prototype.get_type = function(){return this.type}
CAscFill.prototype.put_type = function(v){this.type = v;}
CAscFill.prototype.get_fill = function(){return this.fill;}
CAscFill.prototype.put_fill = function(v){this.fill = v;}
CAscFill.prototype.get_transparent = function(){ return this.transparent; }
CAscFill.prototype.put_transparent = function(v){ this.transparent = v; }

// эта функция ДОЛЖНА минимизироваться
function CreateAscFill(unifill)
{
    if (null == unifill || null == unifill.fill)
        return new CAscFill();

    var ret = new CAscFill();

    var _fill = unifill.fill;
    switch (_fill.type)
    {
        case FILL_TYPE_SOLID:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new CAscFillSolid();
            ret.fill.color = CreateAscColor(_fill.color);
            break;
        }
        case FILL_TYPE_PATT:
        {
            ret.type = c_oAscFill.FILL_TYPE_PATT;
            ret.fill = new CAscFillHatch();
            ret.fill.PatternType = _fill.ftype;
            ret.fill.fgClr = CreateAscColor(_fill.fgClr);
            ret.fill.bgClr = CreateAscColor(_fill.bgClr);
            break;
        }
        case FILL_TYPE_GRAD:
        {
            ret.type = c_oAscFill.FILL_TYPE_GRAD;
            ret.fill = new CAscFillGrad();

            for (var i = 0; i < _fill.colors.length; i++)
            {
                if (0 == i)
                {
                    ret.fill.Colors = new Array();
                    ret.fill.Positions = new Array();
                }

                ret.fill.Colors.push(CreateAscColor(_fill.colors[i].color));
                ret.fill.Positions.push(_fill.colors[i].pos);
            }

            if (_fill.lin)
            {
                ret.fill.GradType = c_oAscFillGradType.GRAD_LINEAR;
                ret.fill.LinearAngle = _fill.lin.angle;
                ret.fill.LinearScale = _fill.lin.scale;
            }
            else
            {
                ret.fill.GradType = c_oAscFillGradType.GRAD_PATH;
                ret.fill.PathType = 0;
            }

            break;
        }
        case FILL_TYPE_BLIP:
        {
            ret.type = c_oAscFill.FILL_TYPE_BLIP;
            ret.fill = new CAscFillBlip();

            ret.fill.url = _fill.RasterImageId;
            ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
            break;
        }
        default:
            break;
    }

    ret.transparent = unifill.transparent;
    return ret;
}
function CorrectUniFill(asc_fill, unifill)
{
    if (null == asc_fill)
        return unifill;

    var ret = unifill;
    if (null == ret)
        ret = new CUniFill();

    var _fill = asc_fill.get_fill();
    var _type = asc_fill.get_type();

    if (null != _type)
    {
        switch (_type)
        {
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.fill = new CNoFill();
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP)
                {
                    ret.fill = new CBlipFill();
                }

                var _url = _fill.get_url();
                var _tx_id = _fill.get_texture_id();
                if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length))
                {
                    _url = g_oUserTexturePresets[_tx_id];
                }

                if (_url != null && _url !== undefined && _url != "")
                    ret.fill.RasterImageId = _url;

                if (ret.fill.RasterImageId == null)
                    ret.fill.RasterImageId = "";

                var tile = _fill.get_type();
                if (tile == c_oAscFillBlipType.STRETCH)
                    ret.fill.tile = null;
                else if (tile == c_oAscFillBlipType.TILE)
                    ret.fill.tile = true;

                break;
            }
            case c_oAscFill.FILL_TYPE_PATT:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_PATT)
                {
                    ret.fill = new CPattFill();
                }

                if (undefined != _fill.PatternType)
                {
                    ret.fill.ftype = _fill.PatternType;
                }
                if (undefined != _fill.fgClr)
                {
                    ret.fill.fgClr = CorrectUniColor(_fill.get_color_fg(), ret.fill.fgClr);
                }
                if (undefined != _fill.bgClr)
                {
                    ret.fill.bgClr = CorrectUniColor(_fill.get_color_bg(), ret.fill.bgClr);
                }

                break;
            }
            case c_oAscFill.FILL_TYPE_GRAD:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_GRAD)
                {
                    ret.fill = new CGradFill();
                }

                var _colors     = _fill.get_colors();
                var _positions  = _fill.get_positions();
                if (undefined != _colors && undefined != _positions)
                {
                    if (_colors.length == _positions.length)
                    {
                        ret.fill.colors.splice(0, ret.fill.colors.length);

                        for (var i = 0; i < _colors.length; i++)
                        {
                            var _gs = new CGs();
                            _gs.color = CorrectUniColor(_colors[i], _gs.color);
                            _gs.pos = _positions[i];

                            ret.fill.colors.push(_gs);
                        }
                    }
                }
                else if (undefined != _colors)
                {
                    if (_colors.length == ret.fill.colors.length)
                    {
                        for (var i = 0; i < _colors.length; i++)
                        {
                            ret.fill.colors[i].color = CorrectUniColor(_colors[i], ret.fill.colors[i].color);
                        }
                    }
                }
                else if (undefined != _positions)
                {
                    if (_positions.length == ret.fill.colors.length)
                    {
                        for (var i = 0; i < _positions.length; i++)
                        {
                            ret.fill.colors[i].pos = _positions[i];
                        }
                    }
                }

                var _grad_type = _fill.get_grad_type();

                if (c_oAscFillGradType.GRAD_LINEAR == _grad_type)
                {
                    var _angle = _fill.get_linear_angle();
                    var _scale = _fill.get_linear_scale();

                    if (!ret.fill.lin)
                        ret.fill.lin = new GradLin();

                    if (undefined != _angle)
                        ret.fill.lin.angle = _angle;
                    if (undefined != _scale)
                        ret.fill.lin.scale = _scale;
                }
                else if (c_oAscFillGradType.GRAD_PATH == _grad_type)
                {
                    ret.fill.lin = null;
                    ret.fill.path = new GradPath();
                }
                break;
            }
            default:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID)
                {
                    ret.fill = new CSolidFill();
                }
                ret.fill.color = CorrectUniColor(_fill.get_color(), ret.fill.color);
            }
        }
    }

    var _alpha = asc_fill.get_transparent();
    if (null != _alpha)
        ret.transparent = _alpha;

    return ret;
}

// ---------------------------------------------------------------

function CAscSlideProps()
{
    this.Background = null;
}

CAscSlideProps.prototype.get_background = function(){return this.Background;}
CAscSlideProps.prototype.put_background = function(v){this.Background = v;}

// ---------------------------------------------------------------

// outline -------------------------------------------------------
function CAscStroke()
{
    this.type = null;
    this.width = null;
    this.color = null;

    this.LineJoin = null;
    this.LineCap = null;

    this.LineBeginStyle = null;
    this.LineBeginSize = null;

    this.LineEndStyle = null;
    this.LineEndSize = null;

    this.canChangeArrows = false;
}
CAscStroke.prototype.get_type = function(){return this.type;}
CAscStroke.prototype.put_type = function(v){this.type = v;}
CAscStroke.prototype.get_width = function(){return this.width;}
CAscStroke.prototype.put_width = function(v){this.width = v;}
CAscStroke.prototype.get_color = function(){return this.color;}
CAscStroke.prototype.put_color = function(v){this.color = v;}

CAscStroke.prototype.get_linejoin = function(){return this.LineJoin;}
CAscStroke.prototype.put_linejoin = function(v){this.LineJoin = v;}
CAscStroke.prototype.get_linecap = function(){return this.LineCap;}
CAscStroke.prototype.put_linecap = function(v){this.LineCap = v;}

CAscStroke.prototype.get_linebeginstyle = function(){return this.LineBeginStyle;}
CAscStroke.prototype.put_linebeginstyle = function(v){this.LineBeginStyle = v;}
CAscStroke.prototype.get_linebeginsize = function(){return this.LineBeginSize;}
CAscStroke.prototype.put_linebeginsize = function(v){this.LineBeginSize = v;}
CAscStroke.prototype.get_lineendstyle = function(){return this.LineEndStyle;}
CAscStroke.prototype.put_lineendstyle = function(v){this.LineEndStyle = v;}
CAscStroke.prototype.get_lineendsize = function(){return this.LineEndSize;}
CAscStroke.prototype.put_lineendsize = function(v){this.LineEndSize = v;}

CAscStroke.prototype.get_canChangeArrows = function(){return this.canChangeArrows;}

// эта функция ДОЛЖНА минимизироваться
function CreateAscStroke(ln, _canChangeArrows)
{
    if (null == ln || null == ln.Fill || ln.Fill.fill == null)
        return new CAscStroke();

    var ret = new CAscStroke();

    var _fill = ln.Fill.fill;
    if(_fill != null)
    {
        switch (_fill.type)
        {
            case FILL_TYPE_BLIP:
            {
                break;
            }
            case FILL_TYPE_SOLID:
            {
                ret.color = CreateAscColor(_fill.color);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_GRAD:
            {
                var _c = _fill.colors;
                if (_c != 0)
                {
                    ret.color = CreateAscColor(_fill.colors[0].color);
                    ret.type = c_oAscStrokeType.STROKE_COLOR;
                }

                break;
            }
            case FILL_TYPE_PATT:
            {
                ret.color = CreateAscColor(_fill.fgClr);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_NOFILL:
            {
                ret.color = null;
                ret.type = c_oAscStrokeType.STROKE_NONE;
                break;
            }
            default:
            {
                break;
            }
        }
    }


    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000.0;

    if (ln.cap != null)
        ret.put_linecap(ln.cap);

    if (ln.LineJoin != null)
        ret.put_linejoin(ln.LineJoin.type);

    if (ln.headEnd != null)
    {
        ret.put_linebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);

        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);

        ret.put_linebeginsize(_w * 3 + _len);
    }
    else
    {
        ret.put_linebeginstyle(LineEndType.None);
    }

    if (ln.tailEnd != null)
    {
        ret.put_lineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);

        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);

        ret.put_lineendsize(_w * 3 + _len);
    }
    else
    {
        ret.put_lineendstyle(LineEndType.None);
    }

    if (true === _canChangeArrows)
        ret.canChangeArrows = true;

    return ret;
}

function CorrectUniStroke(asc_stroke, unistroke)
{
    if (null == asc_stroke)
        return unistroke;

    var ret = unistroke;
    if (null == ret)
        ret = new CLn();

    var _type = asc_stroke.get_type();
    var _w = asc_stroke.get_width();

    if (_w != null && _w !== undefined)
        ret.w = _w * 36000.0;

    var _color = asc_stroke.get_color();
    if (_type == c_oAscStrokeType.STROKE_NONE)
    {
        ret.Fill = new CUniFill();
        ret.Fill.fill = new CNoFill();
    }
    else if (_type != null)
    {
        if (null != _color && undefined !== _color)
        {
            ret.Fill = new CUniFill();
            ret.Fill.type = FILL_TYPE_SOLID;
            ret.Fill.fill = new CSolidFill();
            ret.Fill.fill.color = CorrectUniColor(_color, ret.Fill.fill.color);
        }
    }

    var _join = asc_stroke.get_linejoin();
    if (null != _join)
    {
        ret.LineJoin = new LineJoin();
        ret.LineJoin.type = _join;
    }

    var _cap = asc_stroke.get_linecap();
    if (null != _cap)
    {
        ret.cap = _cap;
    }

    var _begin_style = asc_stroke.get_linebeginstyle();
    if (null != _begin_style)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.type = _begin_style;
    }

    var _end_style = asc_stroke.get_lineendstyle();
    if (null != _end_style)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.type = _end_style;
    }

    var _begin_size = asc_stroke.get_linebeginsize();
    if (null != _begin_size)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.w = 2 - ((_begin_size/3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }

    var _end_size = asc_stroke.get_lineendsize();
    if (null != _end_size)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.w = 2 - ((_end_size/3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }

    return ret;
}

// ---------------------------------------------------------------

// shapePr -------------------------------------------------------
function CAscShapeProp()
{
    this.type = null; // custom
    this.fill = null;
    this.stroke = null;
    this.paddings = null;
}
CAscShapeProp.prototype.get_type = function(){return this.type}
CAscShapeProp.prototype.put_type = function(v){this.type = v;}
CAscShapeProp.prototype.get_fill = function(){return this.fill}
CAscShapeProp.prototype.put_fill = function(v){this.fill = v;}
CAscShapeProp.prototype.get_stroke = function(){return this.stroke}
CAscShapeProp.prototype.put_stroke = function(v){this.stroke = v;}

CAscShapeProp.prototype.get_paddings = function(){return this.paddings}
CAscShapeProp.prototype.put_paddings = function(v){this.paddings = v;}

// эта функция ДОЛЖНА минимизироваться
function CreateAscShapeProp(shape)
{
    if (null == shape)
        return new CAscShapeProp();

    var ret = new CAscShapeProp();
    ret.fill = CreateAscFill(shape.brush);
    ret.stroke = CreateAscStroke(shape.pen);
    var paddings = null;
    if(shape.textBoxContent)
    {
        var body_pr = shape.bodyPr;
        paddings = new CPaddings();
        if(typeof body_pr.lIns === "number")
            paddings.Left = body_pr.lIns;
        else
            paddings.Left = 2.54;

        if(typeof body_pr.tIns === "number")
            paddings.Top = body_pr.tIns;
        else
            paddings.Top = 1.27;

        if(typeof body_pr.rIns === "number")
            paddings.Right = body_pr.rIns;
        else
            paddings.Right = 2.54;

        if(typeof body_pr.bIns === "number")
            paddings.Bottom = body_pr.bIns;
        else
            paddings.Bottom = 1.27;
    }
    return ret;
}

function CreateAscShapePropFromProp(shapeProp)
{
    var obj = new CAscShapeProp();
    if(!isRealObject(shapeProp))
        return obj;

    if(typeof shapeProp.type === "string")
        obj.type = shapeProp.type;
    if(isRealObject(shapeProp.fill))
        obj.fill = CreateAscFill(shapeProp.fill);
    if(isRealObject(shapeProp.stroke))
        obj.stroke = CreateAscStroke(shapeProp.stroke, shapeProp.canChangeArrows);
    if(isRealObject(shapeProp.paddings))
        obj.paddings = shapeProp.paddings;
    return obj;
}

function CorrectShapeProp(asc_shape_prop, shape)
{
    if (null == shape || null == asc_shape_prop)
        return;

    shape.spPr.Fill = CorrectUniFill(asc_shape_prop.get_fill(), shape.spPr.Fill);
    shape.spPr.ln = CorrectUniFill(asc_shape_prop.get_stroke(), shape.spPr.ln);
}

// ---------------------------------------------------------------

// информация о темах --------------------------------------------

function CAscThemeInfo(themeInfo)
{
    this.Obj = themeInfo;
    this.Index = -1000;
}
CAscThemeInfo.prototype.get_Name = function() { return this.Obj["Name"]; }
CAscThemeInfo.prototype.get_Url = function() { return this.Obj["Url"]; }
CAscThemeInfo.prototype.get_Image = function() { return this.Obj["Thumbnail"]; }
CAscThemeInfo.prototype.get_Index = function() { return this.Index; }

function CAscThemes()
{
    this.EditorThemes = new Array();
    this.DocumentThemes = new Array();

    var _count = _presentation_editor_themes.length;
    for (var i = 0; i < _count; i++)
    {
        this.EditorThemes[i] = new CAscThemeInfo(_presentation_editor_themes[i]);
        this.EditorThemes[i].Index = i;
    }
}
CAscThemes.prototype.get_EditorThemes = function(){ return this.EditorThemes; }
CAscThemes.prototype.get_DocumentThemes = function(){ return this.DocumentThemes; }

// ---------------------------------------------------------------

function CAscTableStyle()
{
    this.Id     = "";
    this.Type   = 0;
    this.Image  = "";
}
CAscTableStyle.prototype.get_Id = function(){ return this.Id; }
CAscTableStyle.prototype.get_Image = function(){ return this.Image; }
CAscTableStyle.prototype.get_Type = function(){ return this.Type; }


// ---------------------------------------------------------------
function GenerateTableStyles(drawingDoc, logicDoc, tableLook)
{
    var _dst_styles = [];

    var _styles = logicDoc.Styles.Get_AllTableStyles();
    var _styles_len = _styles.length;

    if (_styles_len == 0)
        return _dst_styles;

    var _x_mar = 10;
    var _y_mar = 10;
    var _r_mar = 10;
    var _b_mar = 10;
    var _pageW = 297;
    var _pageH = 210;

    var W = (_pageW - _x_mar - _r_mar);
    var H = (_pageH - _y_mar - _b_mar);
    var Grid = [];

    var Rows = 5;
    var Cols = 5;

    for (var i = 0; i < Cols; i++)
        Grid[i] = W / Cols;

    var _canvas = document.createElement('canvas');
    if (!this.m_oWordControl.bIsRetinaSupport)
    {
        _canvas.width = TABLE_STYLE_WIDTH_PIX;
        _canvas.height = TABLE_STYLE_HEIGHT_PIX;
    }
    else
    {
        _canvas.width = (TABLE_STYLE_WIDTH_PIX << 1);
        _canvas.height = (TABLE_STYLE_HEIGHT_PIX << 1);
    }
    var ctx = _canvas.getContext('2d');

    History.TurnOff();
    for (var i1 = 0; i1 < _styles_len; i1++)
    {
        var i = _styles[i1];
        var _style = logicDoc.Styles.Style[i];

        if (!_style || _style.Type != styletype_Table)
            continue;

        var table = new CTable(drawingDoc, logicDoc, true, 0, _x_mar, _y_mar, 1000, 1000, Rows, Cols, Grid);
        table.Set_Props({TableStyle : i});

        for (var j = 0; j < Rows; j++)
            table.Content[j].Set_Height(H / Rows, heightrule_AtLeast);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, _canvas.width, _canvas.height);

        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
        graphics.m_oFontManager = g_fontManager;
        graphics.transform(1,0,0,1,0,0);

        table.Recalculate_Page(0);
        table.Draw(0, graphics);

        var _styleD = new CAscTableStyle();
        _styleD.Type = 0;
        _styleD.Image = _canvas.toDataURL("image/png");
        _styleD.Id = i;
        _dst_styles.push(_styleD);
    }
    History.TurnOn();

    return _dst_styles;
}