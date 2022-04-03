import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
import os
import time
orb = cv.ORB_create()


def compare(img1_url=None, img2_url=None):

    img1 = cv.imread(img1_url)
    gray1 = cv.cvtColor(img1, cv.COLOR_BGR2GRAY)
    kp1, desc1 = orb.detectAndCompute(gray1, None)

    img2 = cv.imread(img2_url)
    gray2 = cv.cvtColor(img2, cv.COLOR_BGR2GRAY)
    kp2, desc2 = orb.detectAndCompute(gray2, None)

    FLANN_INDEX_LSH = 6 # 
    index_params= dict(algorithm = FLANN_INDEX_LSH,
                       table_number = 6, # 12
                       key_size = 12,     # 20
                       multi_probe_level = 1) #2

    search_params = dict(checks=50)   # or pass empty dictionary
    flann = cv.FlannBasedMatcher(index_params,search_params) # 匹配临近元素
    matches = flann.knnMatch(desc1,desc2,k=2)

    good = []

# print( [len(a) for a in matches] )

    for i, pair in enumerate(matches):
        try:
            m, n = pair
            if m.distance < 0.7*n.distance:
                good.append(m)
        except ValueError:
            pass

    if len(good) < 4:
        print(  img1_url + ' and ' +  img2_url + ': less than 4 goods to use findHomography')
    else:
        goods_count = '{:d} goods'.format( len( good ) )
        # lower than 10 should be warned
        print(  img1_url + ' and ' +  img2_url + ' matches with ' + goods_count  )

        '''
        plt.subplot(2, 2, 1)
        plt.imshow(img1), plt.title('img1'), plt.show()
        plt.subplot(2, 2, 2)
        plt.imshow(img2), plt.title('img2'), plt.show()
        '''

        '''
        src_pts = np.float32([ kp1[m.queryIdx].pt for m in good ]).reshape(-1, 1, 2)# 双通道
        dst_pts = np.float32([ kp2[m.trainIdx].pt for m in good ]).reshape(-1,1,2)

        M, mask = cv.findHomography(src_pts, dst_pts, cv.RANSAC, 5.0) # 计算多个二维点对之间的最优单映射变换矩阵

        print(M)

        img3 = cv.warpPerspective(img1, M, img1.shape[:2]) # 矩阵变换正面视觉

        ts = time.time()
        filename = '{:f}.jpg'.format(ts)
        cv.imwrite(filename, img3)
        '''


        '''
        plt.subplot(2, 2, 3)
        plt.imshow(img3), plt.title('img3'), plt.show()
        '''


def main():

    hole_dir = './01/hole/1648105878088/' 
    # hole_dir = './01/normal_fake/1648016490587/' 
    normal_dir = './01/normal/1648016490587/'

    arr_hole = os.listdir(hole_dir)
    arr_normal = os.listdir(normal_dir)
    sorted_arr_hole = sorted(arr_hole, key=lambda x:int((x.replace('DJI_', '')).replace('.jpg','')))
    sorted_arr_normal = sorted(arr_normal, key=lambda x:int((x.replace('DJI_', '')).replace('.jpg','')))
    mat = [[0]*2 for i in range(len(sorted_arr_hole))]
    k=0
    for i, j in zip(sorted_arr_hole, sorted_arr_normal):
        mat[k][0]=i
        mat[k][1]=j
        k+=1
    print (mat)

    for img_pair in mat: 
        compare( hole_dir+img_pair[0], normal_dir+img_pair[1])

def test():
    # compare( './01/hole/1648105878088/DJI_0012.jpg', './01/hole/1648105878088/DJI_0035.jpg')
    # compare( './01/normal/1648016490587/DJI_0670.jpg', './01/normal/1648016490587/DJI_0693.jpg')
    
    initial_num = 105 # sky is 14, front is 12 
    gap = 4 # sky is 4, front is 5 
    sky_arr = []
    # img_dir = './01/hole/1648105878088/' 
    img_dir = './01/ziyuan_normal/1648459544009/' 

    for i in range(7):
        if i == 0:
            first_img = '{0}DJI_0{1}.jpg'.format(img_dir, initial_num)
            second_img = '{0}DJI_0{1}.jpg'.format(img_dir, (initial_num + i + gap) )
            compare( first_img, second_img)
        elif i == 6:
            first_img = '{0}DJI_0{1}.jpg'.format(img_dir, initial_num  )
            second_img = '{0}DJI_0{1}.jpg'.format(img_dir, (initial_num + gap + 3 * i ) )
            compare( first_img, second_img)
        else:
            first_img = '{0}DJI_0{1}.jpg'.format(img_dir, initial_num + gap + i * 3 )
            second_img = '{0}DJI_0{1}.jpg'.format(img_dir, (initial_num + gap + 3 * (i + 1) ) )
            compare( first_img, second_img)

if __name__ == "__main__":
    test()
